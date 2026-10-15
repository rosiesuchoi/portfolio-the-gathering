// "The Stack": casting spells (paying their mana cost), triggered abilities, and
// resolving them last-in, first-out. Pure functions over the game state (see gameModel.js).

import { CARD_IDS, getCardById } from './cards.js';
import {
  COMMANDER_ZONE,
  drawCard,
  isCommanderOnBattlefield,
  isComboReady,
  isCreature,
  isInstantOrSorcery,
  isLegendary,
  isOnBattlefield,
  isOnBoard,
  without,
} from './gameModel.js';
import { payCost } from './manaModel.js';

export const STACK_ITEM_KIND = {
  SPELL: 'spell',
  TRIGGER: 'trigger',
};

export const TRIGGER_EFFECT = {
  ORIANNA_DRAW: 'oriannaDraw',
  K_BEAUTY_BUFF: 'kBeautyBuff',
  JODAH_EXILE: 'jodahExile',
};

/** UI-facing side effects that resolving an item asks the controller to perform: { type, cardId? }. */
export const RESOLVE_EFFECT = {
  OPEN_CONTACT: 'openContact',
  JODAH_FOUND_NOTHING: 'jodahFoundNothing',
};

/** Put an item on top of the stack. */
const pushToStack = (state, item) => ({
  ...state,
  stack: [...state.stack, { ...item, id: state.nextStackId }],
  nextStackId: state.nextStackId + 1,
});

const pushTrigger = (state, sourceCardId, effect, targetCardId = null) =>
  pushToStack(state, { kind: STACK_ITEM_KIND.TRIGGER, sourceCardId, effect, targetCardId });

// ---------- Casting ----------

/**
 * Pay for a spell. Omniscience on the battlefield lets you cast spells *from your hand*
 * for free; anything else (e.g. the commander, cast from the command zone) costs mana.
 * Returns the state with the mana spent, or null if the pool can't pay.
 */
const payForCast = (state, card, fromHand) => {
  if (fromHand && isOnBoard(state, CARD_IDS.OMNISCIENCE)) return state;
  const manaPool = payCost(state.manaPool, card.cost);
  return manaPool ? { ...state, manaPool } : null;
};

/**
 * Cast a card from the hand: it leaves the hand and waits on the stack.
 * Returns { ok: true, state } or { ok: false, state, card, fromHand } if it can't be paid for.
 */
export const castFromHand = (state, cardId, position) => {
  const card = getCardById(cardId);
  const paid = payForCast(state, card, true);
  if (!paid) return { ok: false, state, card, fromHand: true };

  let next = pushToStack(
    { ...paid, handIds: without(paid.handIds, cardId) },
    { kind: STACK_ITEM_KIND.SPELL, cardId, position }
  );

  // Jodah: whenever you cast a legendary spell from your hand, trigger (above the spell).
  if (isLegendary(card) && isCommanderOnBattlefield(next)) {
    next = pushTrigger(next, CARD_IDS.COMMANDER, TRIGGER_EFFECT.JODAH_EXILE, cardId);
  }

  return { ok: true, state: next };
};

/**
 * Cast the commander from the command zone: it must be paid for with mana.
 * Returns { ok: true, state } or { ok: false, state, card, fromHand: false }.
 */
export const castCommander = (state, position) => {
  const card = getCardById(CARD_IDS.COMMANDER);
  const paid = payForCast(state, card, false);
  if (!paid) return { ok: false, state, card, fromHand: false };

  return {
    ok: true,
    state: pushToStack(
      { ...paid, commander: { zone: COMMANDER_ZONE.STACK, x: 0, y: 0 } },
      { kind: STACK_ITEM_KIND.SPELL, cardId: CARD_IDS.COMMANDER, position }
    ),
  };
};

// ---------- Resolving ----------

/**
 * A permanent enters the battlefield. Any "enters the battlefield" abilities
 * trigger now and go on the stack (they do not resolve instantly).
 */
const enterBattlefield = (state, card, { x, y }) => {
  let next = card.id === CARD_IDS.COMMANDER
    ? { ...state, commander: { zone: COMMANDER_ZONE.BATTLEFIELD, x, y } }
    : { ...state, boardCards: [...state.boardCards, { id: card.id, x, y, tapped: false }] };

  if (isCreature(card)) {
    // Orianna: draw a card (only the first time she enters).
    if (card.id === CARD_IDS.ORIANNA && !state.hasPlayedOrianna) {
      next = pushTrigger({ ...next, hasPlayedOrianna: true }, card.id, TRIGGER_EFFECT.ORIANNA_DRAW);
    }
    // K-Beauty Matcher: buff each creature that enters while it is on the battlefield.
    if (isOnBoard(state, CARD_IDS.K_BEAUTY_MATCHER)) {
      next = pushTrigger(next, CARD_IDS.K_BEAUTY_MATCHER, TRIGGER_EFFECT.K_BEAUTY_BUFF, card.id);
    }
  }

  return next;
};

/** Resolve a spell: run its effect, then it becomes a permanent or goes to the graveyard. */
const resolveSpell = (state, { cardId, position }) => {
  const card = getCardById(cardId);
  const effects = [];
  let next = state;

  if (cardId === CARD_IDS.PORTFOLIO_SITE) {
    // Puzzle: if the combo is assembled, draw "Let's Connect!" - otherwise draw Orianna once.
    if (isComboReady(next) && !next.hasDrawnContact) {
      next = drawCard({ ...next, hasDrawnContact: true }, CARD_IDS.CONTACT);
    } else if (!next.hasDrawnOrianna) {
      next = drawCard({ ...next, hasDrawnOrianna: true }, CARD_IDS.ORIANNA);
    }
  }

  // Version Control (Regrowth): return the top card of the graveyard to the hand.
  if (cardId === CARD_IDS.VERSION_CONTROL && next.graveyardIds.length > 0) {
    const recoveredId = next.graveyardIds[next.graveyardIds.length - 1];
    next = {
      ...next,
      graveyardIds: next.graveyardIds.slice(0, -1),
      handIds: [...next.handIds, recoveredId],
    };
  }

  // My Hobbies (Infernal Grasp): lose 2 life, only the first time.
  if (cardId === CARD_IDS.HOBBIES && !next.hasPlayedHobbies) {
    next = { ...next, hasPlayedHobbies: true, life: next.life - 2 };
  }

  if (cardId === CARD_IDS.CONTACT) {
    effects.push({ type: RESOLVE_EFFECT.OPEN_CONTACT });
  }

  if (isInstantOrSorcery(card)) {
    next = { ...next, graveyardIds: [...next.graveyardIds, cardId] };
  } else {
    next = enterBattlefield(next, card, position);
  }

  return { state: next, effects };
};

/** Resolve a triggered ability. */
const resolveTrigger = (state, { effect, targetCardId }) => {
  switch (effect) {
    case TRIGGER_EFFECT.ORIANNA_DRAW:
      return { state: drawCard(state, CARD_IDS.VERSION_CONTROL), effects: [] };

    case TRIGGER_EFFECT.K_BEAUTY_BUFF:
      // Fizzles if the creature already left the battlefield.
      if (isOnBattlefield(state, targetCardId) && !state.buffedIds.includes(targetCardId)) {
        return { state: { ...state, buffedIds: [...state.buffedIds, targetCardId] }, effects: [] };
      }
      return { state, effects: [] };

    case TRIGGER_EFFECT.JODAH_EXILE:
      // The library holds no legendary nonland card with a lesser mana value than any spell
      // that can be cast here, so the trigger finds nothing (and exiles nothing).
      return { state, effects: [{ type: RESOLVE_EFFECT.JODAH_FOUND_NOTHING, cardId: targetCardId }] };

    default:
      return { state, effects: [] };
  }
};

/**
 * Pop the top item off the stack and execute it.
 * Returns { state, effects } where effects are UI-facing side effects.
 */
export const resolveTopOfStack = (state) => {
  if (state.stack.length === 0) return { state, effects: [] };

  const item = state.stack[state.stack.length - 1];
  const popped = { ...state, stack: state.stack.slice(0, -1) };

  return item.kind === STACK_ITEM_KIND.SPELL ? resolveSpell(popped, item) : resolveTrigger(popped, item);
};

// ---------- Presentation helpers ----------

/** Plain-language description of a stack item for the Stack UI. */
export const describeStackItem = (item) => {
  if (item.kind === STACK_ITEM_KIND.SPELL) {
    const card = getCardById(item.cardId);
    return {
      id: item.id,
      kind: item.kind,
      title: card.title,
      text: isInstantOrSorcery(card)
        ? card.effect
        : `${card.type}. Enters the battlefield when it resolves.`,
    };
  }

  const source = getCardById(item.sourceCardId);
  const target = item.targetCardId ? getCardById(item.targetCardId) : null;

  let text;
  switch (item.effect) {
    case TRIGGER_EFFECT.K_BEAUTY_BUFF:
      text = `Put a +1/+1 counter on ${target.title}. It gains hexproof until end of turn.`;
      break;
    case TRIGGER_EFFECT.JODAH_EXILE:
      text = `You cast ${target.title}. Exile cards from the top of your library until you exile a legendary nonland card with lesser mana value. You may cast it for free.`;
      break;
    default:
      text = 'When this creature enters the battlefield, draw a card.';
  }

  return { id: item.id, kind: item.kind, title: source.title, text };
};
