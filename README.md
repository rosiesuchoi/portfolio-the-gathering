# portfolio-the-gathering

Project Changelog & Notes - TCG Portfolio

This document tracks the iterative development of the React-based Magic: The Gathering style interactive portfolio.

Feature History & Updates

1. Hover Animations & Dynamic Preview Positioning

Request: Make the hand card hover animation less aggressive. Position the large preview card dynamically above hand cards, and floating smartly next to battlefield/commander cards so it doesn't clip off-screen.

Changes:

Adjusted the CSS transform on HandCard to scale and translate gently.

Replaced fixed preview pane with a dynamic coordinate calculation (previewStyle) in the main App component based on the hovered card's bounding box.

2. Drag & Drop Offset Fix

Request: Fix the bug where dragged cards snap downwards and don't center properly on the mouse cursor.

Changes: Updated the offsetX and offsetY drag calculations to use getBoundingClientRect() to measure the exact distance from the mouse to the unscaled card's top-left corner.

3. "The Resume" Card Identity

Request: Change "The Resume" from an Artifact to a Red Enchantment costing 2 R.

Changes: Updated the CARDS database entry, changing colors, types, mana cost, and rules text.

4. Card Draw Engine & "Orianna" Custom Card

Request: Make "Portfolio Site" draw a card when played, decrement the library, and specifically draw a Secret Lair reskin of "Helpful Hunter" named "Orianna" with a cat picture and custom flavor text.

Changes:

Added the libraryCount state.

Added "Orianna" to the CARDS array.

Added ETB logic in handlePointerUp so playing Portfolio Site draws Orianna and reduces the library count.

5. Starting Library Math & "My Hobbies" (Infernal Grasp)

Request: Adjust the starting library to 93 (99 cards total minus 7 in hand). Add "My Hobbies" (reskin of Infernal Grasp) which deals 2 damage to the player when played.

Changes:

Added life state (starts at 40) and red flash animation.

Fixed starting hand to properly include 7 initial cards.

Added logic so playing "My Hobbies" dynamically reduces the life total by 2.

6. The Graveyard Zone

Request: Add a designated Graveyard zone below the library. Instants and Sorceries should go there automatically when played.

Changes:

Created a graveyardIds array state.

Built the Graveyard UI box below the library deck.

Updated game logic so Sorceries/Instants enter the graveyard stack instead of sticking to the battlefield.

7. Interactive 3D Preview Hologram

Request: Allow the user to move their mouse off a card and onto the large preview pane without it disappearing, and add a 3D tilt effect to the preview.

Changes:

Added a 100ms setTimeout to the onMouseLeave event.

Enabled pointer-events: auto on the preview container.

Added 3D CSS transforms triggered by onMouseMove directly on the MTGCardPreview component.

8. Custom Asset Integration (Orianna & Card Backs)

Request: Use local image assets (orianna.jpg and back.jpg) instead of generic icons and procedural CSS gradients. Fix the image cropping for the portrait cat photo.

Changes:

Updated the card renderer to accept custom image tags.

Set Orianna's image to object-contain and duplicated it as a blurred background layer to prevent black pillarboxing.

Replaced the procedural library deck art with <img src="back.jpg">.

9. Interactive Graveyard Drop-Zone

Request: Allow dragging and dropping cards directly from the hand or battlefield into the graveyard stack, incrementing its count.

Changes: Utilized document.elementFromPoint during the onPointerUp event to detect if the mouse was released over the #graveyard-zone, updating states manually.

10. Late-Game Board Initialization & Tapping Mechanics

Request: Start the game with "Omniscience" and 10 basic lands (2 of each color) on the board. Make the lands fan out horizontally, disable their hover previews, and allow them to "tap" when clicked. Update library math.

Changes:

Added basic lands to the CARDS array.

Calculated a dynamic horizontal fan-out based on window width for the initial boardCards state.

Excluded basic lands from triggering handleMouseEnter.

Added an isTap mathematical check (mouse traveled < 5 pixels) to trigger a 90-degree rotate CSS class instead of picking the card up.

Updated starting library count to 81 (99 - 7 hand - 11 board).

11. Interactive Resume Modal

Request: Summarize actual achievements on "The Resume" flavor text. Make it so clicking/tapping the card on the battlefield opens the full document (eventually settling on Rosie_Choi.png for broad compatibility).

Changes:

Updated the string in the database.

Added a showResumeModal boolean state.

Created a heavily-themed popup overlay containing the high-res, natively scrollable image.

12. Graveyard Recovery Engine (Regrowth)

Request: Add a new card drawn by Orianna's ETB trigger that returns a card from the graveyard to the hand.

Changes:

Created "Version Control" (Secret Lair Regrowth - 1 G Sorcery).

Updated Orianna's drop logic to add Version Control to hand.

Updated Version Control's drop logic to pop the last item off the graveyardIds array and push it into the handIds array, then put itself into the graveyard.

## Project Structure (MVC)

The app is a Vite + React + Tailwind project. Code is split by MVC responsibility:

```
index.html                  Vite entry page
public/                     Static assets (orianna.jpg, back.jpg, Rosie_Choi.png)
src/
  main.jsx                  Mounts <App/>
  App.jsx                   Wires the controller to the main view
  constants.js              DOM ids shared by views and controllers
  models/                   Data + game rules (no React, no DOM)
    cards.js                  Card database (commander, spells, lands) and lookups
    gameModel.js              Initial state, queries and zone transitions (tap, graveyard, move, ...)
    stackModel.js             The Stack: cast (pay mana), resolve (LIFO), triggers, stack item descriptions
    manaModel.js              Mana pool and mana cost parsing/payment
    projects.js               Project artifact data (links, stack, description) + Examine ability
    themes.js                 WUBRG background theme definitions
  controllers/              React hooks that turn user input into model transitions
    useGameController.js      Drag & drop, tapping, drops -> model; exposes state to the view
    useHoverPreview.js        Hover/preview tracking with hide delay
    useContactForm.js         Contact form submission status
    useMouseParallax.js       Publishes mouse position as --mx/--my CSS variables
    hints.js                  Copy for the pop-up hints
  services/
    contactService.js         formsubmit.co network call
  views/                    Presentational components (props in, JSX out)
    pages/GameBoardView.jsx   Full game layout
    components/               CardFace, BoardCard, HandCard, Hand, Library, Graveyard, StackPanel, ManaPool, HintPopup, HandCursor,
                              ThemeSwitcher, ThemeBackground, TopBar, ...
    modals/                   ResumeModal, ContactModal, HowToPlayModal, ProjectModal
    icons/Icons.jsx           SVG icons + key -> icon registry
    utils/previewPosition.js  Hover preview placement
```

## Running

Requires Node.js 18+.

```bash
npm install
npm run dev      # development server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Features added after the MVC refactor

13. The Stack

Playing a card (or casting the commander) no longer resolves instantly: it goes on the Stack (`stack` in the game state) and the Stack panel lists it. "Resolve Top Item" pops the top item (last in, first out) and runs its effect. Permanents enter the battlefield on resolution; Sorceries and Instants run their effect and go to the graveyard. Triggered abilities (Orianna's card draw, K-Beauty Matcher's buff) are put on the Stack when a creature enters, and resolve the same way. K-Beauty Matcher now buffs each creature that enters while it is on the battlefield (instead of auto-buffing every creature on the board).

14. How to Play tutorial

A "How to Play" button in the top bar opens a modal for non-Magic players: dragging, tapping, permanents vs. spells, the Stack, and a collapsible puzzle hint.

15. WUBRG theme switcher

The five mana buttons in the top-left switch the background theme (Plains, Island, Swamp, Mountain, Forest). Each theme is a layered gradient/pattern, cross-faded for a smooth transition.

16. Mana pool, casting costs and Jodah's triggers

Clicking a land on the battlefield taps it and adds one mana of its color to the mana pool; clicking it again un-taps it and removes that mana (not allowed once the mana has been spent; "New Turn" untaps everything and empties the pool). Omniscience makes spells cast from the hand free, but the commander is cast from the Command Zone so it costs W U B R G; if the pool can't pay, a hint popup explains what to do with a live checklist. Rosie Choi (Jodah) now applies its +X/+X to legendary creatures (counting itself) as a live power/toughness badge, and casting a legendary spell from the hand while it is out puts Jodah's exile trigger on the Stack. Cards now move with no animation delay (board cards no longer ease into place, and cards drawn into the hand are instantly interactable), and the opening board re-lays out on window resize until the first card is touched.

17. Animated hand cursor

The native mouse pointer is replaced (for mouse/pen input) by a hand that points with its index finger, tilts slightly as the mouse moves, and pinches while a card is held; it returns to pointing on release. Text fields keep the normal I-beam, and touch devices are unaffected.

18. Project artifacts: Examine ability

The five Artifact cards are projects. Each has an ability costing one mana of a specific color (Portfolio Site U, EV Optimizer R, Board State Analyzer B, Document Organizer W, K-Beauty Matcher G): tap a land of that color, then click the artifact to pay and open its project page (site mock, stack, description, links). After the first time it can be reopened for free. Portfolio Site is a Sorcery, so its version works by clicking it in the graveyard. Edit `src/models/projects.js` to add each project's `liveUrl`, `repoUrl`, `screenshot` (a path under `public/`), `stack` and `details`; the mock becomes a clickable link to the live site once `liveUrl` is set.

19. 3D parallax

`useMouseParallax` publishes the mouse position as `--mx` / `--my` CSS variables on the app root. The background layers and light blobs drift at different depths, battlefield cards, the hand, the command zone and the library pile tilt toward the mouse, the hover preview has a moving glare, and the project mock tilts in 3D. All of it is disabled when the user prefers reduced motion.
