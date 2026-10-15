// Copy for the pop-up hints shown when the player tries something that needs explaining.
// Each hint is { title, body, cost? }; `cost` (a mana cost string) makes the popup show a
// live checklist of the mana the player still needs.

import { CARD_IDS } from '../models/cards.js';
import { MANA_INFO } from '../models/manaModel.js';

/** The player tried to cast a card they can't pay for. */
export const cannotPayHint = ({ card, fromHand }) => {
  if (card.id === CARD_IDS.COMMANDER) {
    const lands = Object.values(MANA_INFO).map(m => m.land).join(', ');
    return {
      title: `Pay ${card.actualName}'s mana cost first`,
      body:
        `Omniscience lets you cast spells from your hand for free, but ${card.title} (${card.actualName}) ` +
        `is cast from the Command Zone, so you still have to pay ${card.cost}. ` +
        `Click lands on the battlefield to tap them for mana (${lands}: one of each color), ` +
        `then drag ${card.title} onto the battlefield again.`,
      cost: card.cost,
    };
  }

  return {
    title: 'Not enough mana',
    body:
      `Omniscience isn't on the battlefield, so ${card.title} costs ${card.cost || '0'} ` +
      `${fromHand ? 'to cast from your hand' : ''}. Click lands to tap them for mana, ` +
      `or put Omniscience back on the battlefield.`,
    cost: card.cost,
  };
};

/** The player tried to untap a land whose mana was already spent. */
export const manaSpentHint = () => ({
  title: 'That mana is already spent',
  body:
    'The mana from this land was used to pay for a spell, so it can\'t be un-tapped. ' +
    'Press "New Turn" in the mana panel to untap everything and empty your mana pool.',
});

/** Jodah's trigger resolved without finding a card. */
export const jodahFoundNothingHint = (card) => ({
  title: "Jodah's trigger found nothing",
  body:
    `You cast ${card.title}, so Jodah, the Unifier triggered. Your library has no legendary nonland ` +
    `card with a lesser mana value, so nothing was exiled.`,
});
