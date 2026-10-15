import { useState } from 'react';
import { CARD_IDS, COMMANDER_CARD, getCardById } from '../models/cards.js';
import {
  DROP_EFFECT,
  createInitialGameState,
  isBattlefieldPosition,
  isKBeautyActive,
  moveBoardCard,
  placeCommander,
  playFromHand,
  returnBoardCardToHand,
  returnCommanderToZone,
  sendToGraveyard,
  toggleTap,
} from '../models/gameModel.js';
import { GRAVEYARD_ZONE_ID } from '../constants.js';
import { useHoverPreview } from './useHoverPreview.js';
import { useContactForm } from './useContactForm.js';

const TAP_MOVEMENT_THRESHOLD_PX = 5;

/**
 * Main controller: translates pointer/hover input from the views into model
 * transitions, and exposes the state the views render.
 */
export function useGameController() {
  const [game, setGame] = useState(() =>
    createInitialGameState({ width: window.innerWidth, height: window.innerHeight })
  );
  const [dragging, setDragging] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showContactScreen, setShowContactScreen] = useState(false);

  const hover = useHoverPreview();
  const contactForm = useContactForm();

  const handlePointerDown = (e, id, source) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    hover.clearHover();

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragging({
      id,
      source,
      offsetX,
      offsetY,
      x: e.clientX - offsetX,
      y: e.clientY - offsetY,
      initialMouseX: e.clientX,
      initialMouseY: e.clientY,
    });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    setDragging(prev => ({
      ...prev,
      x: e.clientX - prev.offsetX,
      y: e.clientY - prev.offsetY,
    }));
  };

  const handlePointerUp = (e) => {
    if (!dragging) return;
    const { id, source, x, y } = dragging;

    const isTap =
      Math.abs(e.clientX - dragging.initialMouseX) < TAP_MOVEMENT_THRESHOLD_PX &&
      Math.abs(e.clientY - dragging.initialMouseY) < TAP_MOVEMENT_THRESHOLD_PX;

    // Is the pointer currently over the graveyard zone?
    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    const isGraveyardDrop = Boolean(dropTarget?.closest(`#${GRAVEYARD_ZONE_ID}`));
    const isBattlefield = isBattlefieldPosition(e.clientY, window.innerHeight) && !isGraveyardDrop;

    // A click without dragging taps the card (and opens the resume for The Resume).
    if (isTap && source === 'board') {
      if (id === CARD_IDS.RESUME) setShowResumeModal(true);
      setGame(toggleTap(game, id));
      setDragging(null);
      return;
    }

    if (isGraveyardDrop && id !== CARD_IDS.COMMANDER) {
      setGame(sendToGraveyard(game, id, source));
    } else if (source === 'hand') {
      if (isBattlefield) {
        const { state, effects } = playFromHand(game, id, { x, y });
        setGame(state);
        if (effects.includes(DROP_EFFECT.OPEN_CONTACT)) setShowContactScreen(true);
      }
    } else if (source === 'board') {
      setGame(isBattlefield ? moveBoardCard(game, id, { x, y }) : returnBoardCardToHand(game, id));
    } else if (source === 'commander') {
      setGame(isBattlefield ? placeCommander(game, { x, y }) : returnCommanderToZone(game));
    }

    setDragging(null);
  };

  return {
    // model state
    handIds: game.handIds,
    boardCards: game.boardCards,
    graveyardIds: game.graveyardIds,
    commander: game.commander,
    life: game.life,
    libraryCount: game.libraryCount,
    isKBeautyActive: isKBeautyActive(game),

    // drag state
    dragging,
    draggedCard: dragging ? getCardById(dragging.id) : null,

    // hover preview
    hoverState: hover.hoverState,
    previewCard: hover.hoverState ? getCardById(hover.hoverState.id) : null,
    isPreviewVisible: Boolean(hover.hoverState) && !dragging,

    // modals + contact form
    showResumeModal,
    showContactScreen,
    closeResumeModal: () => setShowResumeModal(false),
    closeContactScreen: () => setShowContactScreen(false),
    contactForm,

    // event handlers
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleMouseEnter: hover.handleMouseEnter,
    handleMouseLeave: hover.handleMouseLeave,
    cancelPreviewHide: hover.cancelHide,

    commanderCard: COMMANDER_CARD,
  };
}
