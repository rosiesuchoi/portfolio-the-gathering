// Core game state, queries and zone transitions. Framework-free: every function
// takes the current game state and returns a new one (never mutates).
// Casting and resolving spells/triggers lives in stackModel.js.

import { CARDS, CARD_IDS, LAND_IDS, getCardById } from './cards.js';
import { emptyManaPool } from './manaModel.js';

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

/**
 * Starting positions: Omniscience (played last turn) centered high up and the 10 basic
 * lands fanned out in a horizontal line. Clamped so every card stays on screen.
 */
const startingPositions = (width, height) => {
  const spacing = Math.max(36, Math.min(90, (width - 200) / LAND_IDS.length));
  const rowWidth = spacing * (LAND_IDS.length - 1) + 100;
  const startX = Math.max(8, (width - rowWidth) / 2);
  const startY = height / 2 + 10;

  const positions = {
    [CARD_IDS.OMNISCIENCE]: { x: Math.max(8, width / 2 - 60), y: Math.max(80, startY - 200) },
  };
  LAND_IDS.forEach((id, index) => {
    positions[id] = { x: startX + index * spacing, y: startY };
  });
  return positions;
};

const startingBoard = (width, height) => {
  const positions = startingPositions(width, height);
  return [CARD_IDS.OMNISCIENCE, ...LAND_IDS].map(id => ({ id, ...positions[id], tapped: false }));
};

/**
 * Re-run the starting layout for the opening cards (e.g. when the window is resized
 * before the player has touched anything). Tapped state and other cards are untouched.
 */
export const relayoutStartingBoard = (state, { width, height }) => {
  const positions = startingPositions(width, height);
  return {
    ...state,
    boardCards: state.boardCards.map(c => (positions[c.id] ? { ...c, ...positions[c.id] } : c)),
  };
};

export const createInitialGameState = ({ width = 1200, height = 800 } = {}) => ({
  handIds: startingHandIds(),
  boardCards: startingBoard(width, height),
  graveyardIds: [],
  commander: { zone: COMMANDER_ZONE.COMMAND, x: 0, y: 0 },
  manaPool: emptyManaPool(),
  life: STARTING_LIFE,
  libraryCount: STARTING_LIBRARY_COUNT,
  // The Stack: last item in the array is the top and resolves first (LIFO).
  stack: [],
  nextStackId: 1,
  // Creatures that received the K-Beauty Matcher counter/hexproof trigger.
  buffedIds: [],
  // Project artifacts whose "Examine" ability has been paid for (reopening is free).
  unlockedProjectIds: [],
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

export const isLegendary = (card) => card.type.includes('Legendary');

export const isLegendaryCreature = (card) => isLegendary(card) && isCreature(card);

/** Number of legendary creatures currently on the battlefield (the commander counts itself). */
export const countLegendaryCreatures = (state) => {
  const onBoard = state.boardCards.filter(c => isLegendaryCreature(getCardById(c.id))).length;
  return onBoard + (isCommanderOnBattlefield(state) ? 1 : 0);
};

/**
 * Current power/toughness of a creature on the battlefield, with continuous effects applied:
 *  - Jodah (Rosie Choi): legendary creatures get +X/+X, X = number of legendary creatures
 *    (it sees itself, so X is at least 1 while it is on the battlefield).
 *  - K-Beauty Matcher: a +1/+1 counter on creatures that entered while it was out.
 * Returns null if the card is not a creature with stats on the battlefield.
 */
export const getBattlefieldStats = (state, cardId) => {
  if (!isOnBattlefield(state, cardId)) return null;
  const card = getCardById(cardId);
  if (!card || !isCreature(card) || !card.stats) return null;

  const [basePower, baseToughness] = card.stats.split('/').map(Number);
  const jodahBonus = isCommanderOnBattlefield(state) && isLegendaryCreature(card)
    ? countLegendaryCreatures(state)
    : 0;
  const counters = state.buffedIds.includes(cardId) ? 1 : 0;
  const bonus = jodahBonus + counters;

  return {
    label: `${basePower + bonus}/${baseToughness + bonus}`,
    base: card.stats,
    jodahBonus,
    counters,
    modified: bonus > 0,
  };
};

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

export const TAP_RESULT = {
  OK: 'ok',
  // Untapping a land whose mana was already spent isn't allowed.
  MANA_SPENT: 'manaSpent',
};

/**
 * Click on a battlefield card. Tapping a land adds one mana of its color to the pool;
 * untapping it takes that mana back out. Other permanents just rotate.
 * Returns { state, result }.
 */
export const tapCard = (state, cardId) => {
  const boardCard = state.boardCards.find(c => c.id === cardId);
  if (!boardCard) return { state, result: TAP_RESULT.OK };

  const tapped = !boardCard.tapped;
  const toggled = {
    ...state,
    boardCards: state.boardCards.map(c => c.id === cardId ? { ...c, tapped } : c),
  };

  const color = getCardById(cardId).produces;
  if (!color) return { state: toggled, result: TAP_RESULT.OK };

  if (tapped) {
    return { state: { ...toggled, manaPool: { ...state.manaPool, [color]: state.manaPool[color] + 1 } }, result: TAP_RESULT.OK };
  }
  if (state.manaPool[color] < 1) return { state, result: TAP_RESULT.MANA_SPENT };
  return { state: { ...toggled, manaPool: { ...state.manaPool, [color]: state.manaPool[color] - 1 } }, result: TAP_RESULT.OK };
};

/** Untap everything and empty the mana pool. */
export const startNewTurn = (state) => ({
  ...state,
  boardCards: state.boardCards.map(c => ({ ...c, tapped: false })),
  manaPool: emptyManaPool(),
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
