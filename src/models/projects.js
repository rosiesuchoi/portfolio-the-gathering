// The five "Artifact" cards are portfolio projects. This file is the single place to fill in
// each project's details:
//   liveUrl     - deployed site URL (string) or null while it isn't deployed
//   liveNote    - optional short text shown instead of "coming soon" when there will be no live site
//                 (e.g. a game that isn't a web page)
//   repoUrl     - source repository URL or null
//   reflection  - optional personal note shown in the modal (e.g. what was hardest)
//   reflectionTitle - optional heading for the note (defaults to "The hardest part")
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

  [CARD_IDS.RESUME_FORGE]: {
    artifactNumber: 3,
    abilityColor: 'B',
    summary: "Turns any resume into an ATS-optimized Jake's Resume (LaTeX, ready for Overleaf) with Google XYZ bullets, live SWE job matching and AI coaching.",
    details: [
      "Drop in a resume PDF (or paste the text) in any layout, and it is read and converted into the structure of Jake's Resume, a popular single-column LaTeX template that you can open in Overleaf.",
      'The tool walks you through five steps: upload your resume, pick a target job, get a tailored resume, browse a job board, and chat with an AI coach.',
      "Bullets are rewritten in Google's XYZ format (accomplished X, as measured by Y, by doing Z), and the resume is checked against the target job with an ATS keyword match.",
      'The job board matches you to live software-engineering openings, using the SimplifyJobs listings on GitHub. Your data stays in the browser and is only sent to the AI for processing.',
    ],
    stack: ['Next.js', 'React', 'LaTeX (Overleaf)', 'Vercel'],
    liveUrl: 'https://resume-forge-six-pi.vercel.app/',
    repoUrl: null,
    screenshot: 'projects/resume-forge.jpg',
  },

  [CARD_IDS.STITCH_SURVIVAL]: {
    artifactNumber: 4,
    abilityColor: 'W',
    summary: 'A Roblox game built together with another student in Roblox Studio, as preparation for our moonshot project.',
    details: [
      'The goal was to practice building a complete game as a pair, so our group could successfully make one for the moonshot project.',
      'You can play the current test version on Roblox.',
    ],
    stack: ['Roblox Studio', 'Git & GitHub'],
    liveUrl: 'https://www.roblox.com/games/85929683455229/StitchSurvival-Test',
    repoUrl: null,
    screenshot: null,
    reflectionTitle: 'What I learned',
    reflection:
      'I learned about the difficulties of using AI for game development. A lot of the concept felt very short, and through the use of AI there wasn\'t as much life as I thought there would be. ' +
      'In the near future, I plan on optimizing this and making sure that it\'ll be fun for everyone.',
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
