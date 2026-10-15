// Core game state, queries and zone transitions. Framework-free: every function
// takes the current game state and returns a new one (never mutates).
// Casting and resolving spells/triggers lives in stackModel.js.

import { CARDS, CARD_IDS, LAND_IDS } from './cards.js';

// Pixels at the bottom of the viewport reserved for the hand.
export const HAND_AREA_HEIGHT = 180;
export const STARTING_LIFE = 40;
// 99 cards total - 7 in hand - 11 on board.
export const STARTING_LIBRARY_COUNT = 81;

// Where the commander currently is.
export const COMMANDER_ZONE = {
  COMMAND: 'command',
  STACK: 'stack',
  BATTLEFIELD: 'battlefield',
};

export const without = (ids, id) => ids.filter(i => i !== id);

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
  commander: { zone: COMMANDER_ZONE.COMMAND, x: 0, y: 0 },
  life: STARTING_LIFE,
  libraryCount: STARTING_LIBRARY_COUNT,
  // The Stack: last item in the array is the top and resolves first (LIFO).
  stack: [],
  nextStackId: 1,
  // Creatures that received the K-Beauty Matcher counter/hexproof trigger.
  buffedIds: [],
  hasDrawnOrianna: false,
  hasPlayedOrianna: false,
  hasPlayedHobbies: false,
  hasDrawnContact: false,
});

// ---------- Queries ----------

export const isOnBoard = (state, cardId) => state.boardCards.some(c => c.id === cardId);

export const isCommanderOnBattlefield = (state) =>
  state.commander.zone === COMMANDER_ZONE.BATTLEFIELD;

/** True if the card is a permanent currently on the battlefield (commander included). */
export const isOnBattlefield = (state, cardId) =>
  cardId === CARD_IDS.COMMANDER ? isCommanderOnBattlefield(state) : isOnBoard(state, cardId);

export const isBattlefieldPosition = (clientY, viewportHeight) =>
  clientY < viewportHeight - HAND_AREA_HEIGHT;

export const isCreature = (card) => card.type.toLowerCase().includes('creature');

export const isInstantOrSorcery = (card) =>
  card.type.includes('Sorcery') || card.type.includes('Instant');

/**
 * Win-condition puzzle: Commander, The Resume and Board State Analyzer are on the
 * battlefield, and Orianna has already been drawn (i.e. Regrowth was used).
 */
export const isComboReady = (state) =>
  isCommanderOnBattlefield(state) &&
  isOnBoard(state, CARD_IDS.RESUME) &&
  isOnBoard(state, CARD_IDS.BOARD_STATE_ANALYZER) &&
  state.hasDrawnOrianna;

// ---------- Transitions ----------

/** Permanents that leave the battlefield lose their K-Beauty buff. */
const withoutBuff = (state, cardId) => ({ ...state, buffedIds: without(state.buffedIds, cardId) });

/** Draw a specific card into the hand, decrementing the library. */
export const drawCard = (state, cardId) => ({
  ...state,
  handIds: [...state.handIds, cardId],
  libraryCount: state.libraryCount - 1,
});

export const toggleTap = (state, cardId) => ({
  ...state,
  boardCards: state.boardCards.map(c => c.id === cardId ? { ...c, tapped: !c.tapped } : c),
});

/** Drop a card from the hand or battlefield onto the graveyard. */
export const sendToGraveyard = (state, cardId, source) =>
  withoutBuff({
    ...state,
    handIds: source === 'hand' ? without(state.handIds, cardId) : state.handIds,
    boardCards: source === 'board' ? state.boardCards.filter(c => c.id !== cardId) : state.boardCards,
    graveyardIds: [...state.graveyardIds, cardId],
  }, cardId);

export const moveBoardCard = (state, cardId, { x, y }) => ({
  ...state,
  boardCards: state.boardCards.map(c => c.id === cardId ? { ...c, x, y } : c),
});

export const returnBoardCardToHand = (state, cardId) =>
  withoutBuff({
    ...state,
    boardCards: state.boardCards.filter(c => c.id !== cardId),
    handIds: [...state.handIds, cardId],
  }, cardId);

/** Reposition the commander while it is already on the battlefield. */
export const moveCommander = (state, { x, y }) => ({
  ...state,
  commander: { zone: COMMANDER_ZONE.BATTLEFIELD, x, y },
});

export const returnCommanderToZone = (state) =>
  withoutBuff({
    ...state,
    commander: { zone: COMMANDER_ZONE.COMMAND, x: 0, y: 0 },
  }, CARD_IDS.COMMANDER);
