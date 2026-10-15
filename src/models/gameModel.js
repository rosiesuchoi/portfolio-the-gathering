// Game rules and state transitions. Framework-free: every function takes the
// current game state and returns a new one (never mutates).

import { CARDS, CARD_IDS, LAND_IDS, getCardById } from './cards.js';

// Pixels at the bottom of the viewport reserved for the hand.
export const HAND_AREA_HEIGHT = 180;
export const STARTING_LIFE = 40;
// 99 cards total - 7 in hand - 11 on board.
export const STARTING_LIBRARY_COUNT = 81;

export const DROP_EFFECT = {
  OPEN_CONTACT: 'openContact',
};

const without = (ids, id) => ids.filter(i => i !== id);

/** Cards in the opening hand: ids 2-9 except Orianna (drawn later via Portfolio Site). */
const startingHandIds = () =>
  CARDS.map(c => c.id).filter(id => id < CARD_IDS.OMNISCIENCE && id !== CARD_IDS.ORIANNA);

/** Omniscience centered high up, the 10 basic lands fanned out in a horizontal line. */
const startingBoard = (width, height) => {
  const spacing = Math.min(90, (width - 200) / LAND_IDS.length);
  const startX = (width - (spacing * (LAND_IDS.length - 1)) - 100) / 2;
  const startY = height / 2 + 10;

  return [
    { id: CARD_IDS.OMNISCIENCE, x: width / 2 - 60, y: startY - 200, tapped: false },
    ...LAND_IDS.map((id, index) => ({
      id,
      x: startX + index * spacing,
      y: startY,
      tapped: false,
    })),
  ];
};

export const createInitialGameState = ({ width = 1200, height = 800 } = {}) => ({
  handIds: startingHandIds(),
  boardCards: startingBoard(width, height),
  graveyardIds: [],
  commander: { inZone: true, x: 0, y: 0 },
  life: STARTING_LIFE,
  libraryCount: STARTING_LIBRARY_COUNT,
  hasDrawnOrianna: false,
  hasPlayedOrianna: false,
  hasPlayedHobbies: false,
  hasDrawnContact: false,
});

// ---------- Queries ----------

export const isOnBoard = (state, cardId) => state.boardCards.some(c => c.id === cardId);

/** K-Beauty Matcher on the battlefield buffs every creature. */
export const isKBeautyActive = (state) => isOnBoard(state, CARD_IDS.K_BEAUTY_MATCHER);

export const isBattlefieldPosition = (clientY, viewportHeight) =>
  clientY < viewportHeight - HAND_AREA_HEIGHT;

/**
 * Win-condition puzzle: Commander, The Resume and Board State Analyzer are on the
 * battlefield, and Orianna has already been drawn (i.e. Regrowth was used).
 */
export const isComboReady = (state) =>
  !state.commander.inZone &&
  isOnBoard(state, CARD_IDS.RESUME) &&
  isOnBoard(state, CARD_IDS.BOARD_STATE_ANALYZER) &&
  state.hasDrawnOrianna;

const isInstantOrSorcery = (card) =>
  card.type.includes('Sorcery') || card.type.includes('Instant');

// ---------- Transitions ----------

export const toggleTap = (state, cardId) => ({
  ...state,
  boardCards: state.boardCards.map(c => c.id === cardId ? { ...c, tapped: !c.tapped } : c),
});

/** Drop a card from the hand or battlefield onto the graveyard. */
export const sendToGraveyard = (state, cardId, source) => ({
  ...state,
  handIds: source === 'hand' ? without(state.handIds, cardId) : state.handIds,
  boardCards: source === 'board' ? state.boardCards.filter(c => c.id !== cardId) : state.boardCards,
  graveyardIds: [...state.graveyardIds, cardId],
});

export const moveBoardCard = (state, cardId, { x, y }) => ({
  ...state,
  boardCards: state.boardCards.map(c => c.id === cardId ? { ...c, x, y } : c),
});

export const returnBoardCardToHand = (state, cardId) => ({
  ...state,
  boardCards: state.boardCards.filter(c => c.id !== cardId),
  handIds: [...state.handIds, cardId],
});

export const placeCommander = (state, { x, y }) => ({
  ...state,
  commander: { inZone: false, x, y },
});

export const returnCommanderToZone = (state) => ({
  ...state,
  commander: { inZone: true, x: 0, y: 0 },
});

/** Draw a specific card into the hand, decrementing the library. */
const drawCard = (state, cardId) => ({
  ...state,
  handIds: [...state.handIds, cardId],
  libraryCount: state.libraryCount - 1,
});

/**
 * Play a card from the hand onto the battlefield at the given position,
 * resolving its on-play triggers.
 * Returns { state, effects } where effects are UI-facing side effects.
 */
export const playFromHand = (state, cardId, position) => {
  const card = getCardById(cardId);
  const effects = [];
  let next = { ...state, handIds: without(state.handIds, cardId) };

  if (!card) return { state: next, effects };

  if (cardId === CARD_IDS.PORTFOLIO_SITE) {
    if (isComboReady(state) && !state.hasDrawnContact) {
      next = drawCard({ ...next, hasDrawnContact: true }, CARD_IDS.CONTACT);
    } else if (!state.hasDrawnOrianna) {
      next = drawCard({ ...next, hasDrawnOrianna: true }, CARD_IDS.ORIANNA);
    }
  }

  // Orianna ETB: draw Version Control (Regrowth).
  if (cardId === CARD_IDS.ORIANNA && !state.hasPlayedOrianna) {
    next = drawCard({ ...next, hasPlayedOrianna: true }, CARD_IDS.VERSION_CONTROL);
  }

  // Version Control: return the top card of the graveyard to the hand.
  if (cardId === CARD_IDS.VERSION_CONTROL && next.graveyardIds.length > 0) {
    const recoveredId = next.graveyardIds[next.graveyardIds.length - 1];
    next = {
      ...next,
      graveyardIds: next.graveyardIds.slice(0, -1),
      handIds: [...next.handIds, recoveredId],
    };
  }

  // My Hobbies (Infernal Grasp): lose 2 life, only the first time.
  if (cardId === CARD_IDS.HOBBIES && !state.hasPlayedHobbies) {
    next = { ...next, hasPlayedHobbies: true, life: next.life - 2 };
  }

  if (cardId === CARD_IDS.CONTACT) {
    effects.push(DROP_EFFECT.OPEN_CONTACT);
  }

  if (isInstantOrSorcery(card)) {
    next = { ...next, graveyardIds: [...next.graveyardIds, cardId] };
  } else {
    next = {
      ...next,
      boardCards: [...next.boardCards, { id: cardId, x: position.x, y: position.y, tapped: false }],
    };
  }

  return { state: next, effects };
};
