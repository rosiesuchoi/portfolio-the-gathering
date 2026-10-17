// The five "Artifact" cards are portfolio projects. This file is the single place to fill in
// each project's details:
//   liveUrl     - deployed site URL (string) or null while it isn't deployed
//   repoUrl     - source repository URL or null
//   screenshot  - image path under /public (e.g. 'projects/ev-optimizer.png') or null to show a mock
//   stack       - technologies used (array of strings)
//   details     - longer description, one paragraph per entry
// Anything left null / empty shows a friendly "coming soon" state in the project modal.

import { CARD_IDS, getCardById } from './cards.js';
import { payCost } from './manaModel.js';

export const PROJECTS = {
  [CARD_IDS.PORTFOLIO_SITE]: {
    artifactNumber: 1,
    abilityColor: 'U',
    summary: 'An interactive, TCG-style React portfolio built to showcase quarter projects.',
    details: [
      'You are standing in it. Every card on the table is a piece of this portfolio, and playing the cards is how you explore it.',
      'Dragging, tapping and dropping cards runs on a custom pointer-event engine (no drag-and-drop library). Cards move between the hand, battlefield, graveyard and command zone.',
      "A small rules engine models Magic's stack, mana pool and casting costs: spells and triggers wait on a last-in, first-out stack and resolve one at a time.",
      'The code is organised as MVC: models hold card data and game rules, controllers are React hooks that turn input into model changes, and views are presentational components. Mouse-driven 3D parallax and a WUBRG theme switcher round it out.',
    ],
    stack: ['React 18', 'Vite', 'Tailwind CSS', 'JavaScript (ES modules)', 'Pointer Events API'],
    liveUrl: null,
    repoUrl: 'https://github.com/rosiesuchoi/portfolio-the-gathering',
    screenshot: null,
  },

  [CARD_IDS.MUSE_COACH]: {
    artifactNumber: 2,
    abilityColor: 'R',
    summary: 'A fitness and nutrition coaching app: pick a celebrity training style you admire and get a coach, a weekly plan and meals built around your own body.',
    details: [
      'The celebrity you pick only chooses your coach. Your calorie and training targets come from your own body and are kept within healthy limits.',
      'You get a training style, a weekly plan and tips from your coach. You can log what you eat by hand, or from a photo: the AI identifies the food and estimates the amount, and the nutrition numbers come from USDA data.',
      'A Meals section offers recipes with portions scaled to your daily calorie target, with ingredients and cooking steps.',
      'There are two editions that share one UI: a Python server version, and an in-browser JavaScript port that runs on GitHub Pages (with a parity check to keep the math identical). Your data stays in localStorage on your own device, and your API key is only ever sent to Anthropic.',
    ],
    stack: ['JavaScript', 'HTML & CSS', 'Python', 'Anthropic API', 'USDA FoodData', 'localStorage'],
    liveUrl: 'https://rosiesuchoi.github.io/MuseCoach/',
    repoUrl: null,
    screenshot: 'projects/muse-coach.jpg',
  },

  [CARD_IDS.BOARD_STATE_ANALYZER]: {
    artifactNumber: 3,
    abilityColor: 'B',
    summary: 'An AI-powered tool for Magic: The Gathering that evaluates complex board states and suggests optimal plays or powerful synergies.',
    details: [],
    stack: [],
    liveUrl: null,
    repoUrl: null,
    screenshot: null,
  },

  [CARD_IDS.DOCUMENT_ORGANIZER]: {
    artifactNumber: 4,
    abilityColor: 'W',
    summary: 'A streamlined, highly accessible web interface to help elderly family members track and organize tax forms and wire transfer receipts.',
    details: [],
    stack: [],
    liveUrl: null,
    repoUrl: null,
    screenshot: null,
  },

  [CARD_IDS.K_BEAUTY_MATCHER]: {
    artifactNumber: 5,
    abilityColor: 'G',
    summary: 'A computer vision tool that analyzes skin undertones to recommend accurate base foundation matches across brands.',
    details: [],
    stack: [],
    liveUrl: null,
    repoUrl: null,
    screenshot: null,
  },
};

export const getProject = (cardId) => PROJECTS[cardId] ?? null;

/**
 * Activate a project card's "Examine" ability. The first time costs one mana of the project's
 * color (paid from the mana pool); once examined, it can be reopened for free.
 * Returns { ok: true, state } or { ok: false, card, color } if the mana isn't available.
 */
export const examineProject = (state, cardId) => {
  const project = PROJECTS[cardId];
  if (state.unlockedProjectIds.includes(cardId)) return { ok: true, state };

  const manaPool = payCost(state.manaPool, project.abilityColor);
  if (!manaPool) return { ok: false, card: getCardById(cardId), color: project.abilityColor };

  return {
    ok: true,
    state: { ...state, manaPool, unlockedProjectIds: [...state.unlockedProjectIds, cardId] },
  };
};
