import React from 'react';
import { MANA_COLORS, MANA_INFO, parseManaCost } from '../../models/manaModel.js';

/** Live "what you still need" list for a mana cost, checked against the current pool. */
function CostChecklist({ cost, pool }) {
  const { generic, colored } = parseManaCost(cost);
  const needed = MANA_COLORS.filter(c => colored[c] > 0);

  return (
    <ul className="flex flex-wrap gap-2 mt-3" aria-label={`Mana needed: ${cost}`}>
      {needed.map(color => {
        const have = pool[color];
        const ok = have >= colored[color];
        return (
          <li
            key={color}
            className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-bold ${ok ? 'border-green-600 bg-green-100 text-green-900' : 'border-stone-400 bg-white text-stone-700'}`}
          >
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${MANA_INFO[color].className}`}>{color}</span>
            {MANA_INFO[color].land}: {have}/{colored[color]} {ok ? '✓' : ''}
          </li>
        );
      })}
      {generic > 0 && (
        <li className="rounded-full border border-stone-400 bg-white px-2 py-1 text-xs font-bold text-stone-700">
          + {generic} of any color
        </li>
      )}
    </ul>
  );
}

/**
 * Non-blocking popup that explains why an action didn't work and what to do instead.
 * It doesn't dim the board, so the player can act on the hint (e.g. tap lands) while
 * it's open and watch the checklist update.
 */
export default function HintPopup({ hint, manaPool, onClose }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[60] top-[76px] left-1/2 -translate-x-1/2 w-[min(92vw,26rem)] bg-stone-100 text-stone-900 border-4 border-[#D4AF37] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] font-sans pointer-events-auto"
    >
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 rounded-t-md">
        <h2 className="text-white font-serif font-bold text-base md:text-lg drop-shadow-md">{hint.title}</h2>
      </div>
      <div className="p-4">
        <p className="text-sm leading-relaxed text-stone-800">{hint.body}</p>
        {hint.cost && <CostChecklist cost={hint.cost} pool={manaPool} />}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm rounded shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
