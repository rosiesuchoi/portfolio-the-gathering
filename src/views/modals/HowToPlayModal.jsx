import React, { useEffect } from 'react';
import { IconHelp } from '../icons/Icons.jsx';

const Section = ({ title, children }) => (
  <section>
    <h3 className="text-base md:text-lg font-bold text-amber-900 mb-1">{title}</h3>
    <div className="text-sm md:text-base text-stone-800 leading-relaxed flex flex-col gap-2">{children}</div>
  </section>
);

/** Beginner-friendly guide for visitors who don't know Magic: The Gathering. */
export default function HowToPlayModal({ onClose }) {
  // Close with the Escape key.
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8" onPointerDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-play-title"
        className="relative w-full max-w-2xl max-h-[85vh] bg-stone-100 border-[6px] border-[#D4AF37] rounded-xl shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
        onPointerDown={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-3 border-b-4 border-black flex justify-between items-center shadow-lg">
          <h2 id="how-to-play-title" className="text-white font-serif font-bold text-lg md:text-xl tracking-wider flex items-center gap-2 drop-shadow-md">
            <IconHelp size={24} /> How to Play
          </h2>
          <button
            type="button"
            className="text-white hover:bg-white/20 font-sans font-bold px-4 py-1.5 bg-black/40 rounded border border-black/50 transition-colors shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={onClose}
          >
            Close [X]
          </button>
        </div>

        <div className="p-5 md:p-7 overflow-y-auto flex flex-col gap-5 font-sans">
          <p className="text-sm md:text-base text-stone-700">
            No Magic: The Gathering experience needed. Each card on this page is a piece of my portfolio,
            and playing them is how you explore it.
          </p>

          <Section title="Dragging cards">
            <p>
              Your <strong>hand</strong> is along the bottom. Drag a card up onto the open
              <strong> battlefield</strong> to play it. Drag a card on the battlefield to move it, or drag it
              back down to your hand to take it back. Drop a card on the <strong>Graveyard</strong> (right side)
              to discard it. Hover over any card to see it up close.
            </p>
          </Section>

          <Section title="Tapping lands">
            <p>
              Click (or tap) a card on the battlefield, such as one of the basic lands, to rotate it. That is
              called <strong>tapping</strong>: in the real game it spends the card's mana to pay for spells.
              Here it's just for fun, with one exception: clicking <strong>The Resume</strong> opens my full resume.
            </p>
          </Section>

          <Section title="Reading card types">
            <p>
              The line under a card's name says what it is. <strong>Permanents</strong> (Creatures, Artifacts,
              Enchantments, Lands) stay on the battlefield after you play them.
              <strong> Spells</strong> (Sorceries and Instants) do their effect once, then go to the graveyard.
            </p>
          </Section>

          <Section title="The Stack">
            <p>
              In Magic, nothing happens instantly. A spell you play, or an ability that triggers, first waits on
              <strong> the Stack</strong>, shown in the panel near the top right.
            </p>
            <p>
              Items resolve <strong>last in, first out</strong>, like a pile of plates: the newest item sits on
              top and goes first. Press <strong>Resolve Top Item</strong> to carry out the top one. If you play
              several cards before resolving, you'll see them resolve in reverse order. Some cards also trigger
              new items on the Stack when they resolve, so keep an eye on it.
            </p>
            <p className="text-stone-600 text-sm">
              (The real game limits what you can add to the Stack and when. Here you can add anything, so you can
              see how the order works.)
            </p>
          </Section>

          <details className="bg-amber-100 border border-amber-400 rounded-lg p-3">
            <summary className="cursor-pointer font-bold text-amber-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded">
              Hint: solving the portfolio puzzle
            </summary>
            <div className="mt-2 text-sm md:text-base text-stone-800 leading-relaxed flex flex-col gap-2">
              <p>
                Look for card synergies. Read the rules text on each card, especially <em>Board State Analyzer</em>,
                and notice which cards mention each other.
              </p>
              <p>
                Some cards draw other cards, and the graveyard isn't a dead end. Think about which cards you want
                on the battlefield, which ones you need to play first, and the order you resolve them in. When
                the pieces line up, something new shows up in your hand.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
