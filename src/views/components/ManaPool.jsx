import React from 'react';
import { MANA_COLORS, MANA_INFO, totalMana } from '../../models/manaModel.js';

/**
 * Mana pool counter. Tapping a land adds one mana of its color; un-tapping removes it.
 * "New Turn" untaps everything and empties the pool.
 */
export default function ManaPool({ pool, onNewTurn }) {
  return (
    <div className="bg-stone-800 border border-stone-600 rounded p-2 shadow-lg font-sans">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="text-[10px] text-stone-300 uppercase tracking-widest">Mana</span>
        <span className="text-sm font-bold text-white leading-none" aria-label={`${totalMana(pool)} mana available`}>
          {totalMana(pool)}
        </span>
      </div>

      <div className="flex gap-1.5" role="list" aria-label="Mana pool">
        {MANA_COLORS.map(color => (
          <div
            key={color}
            role="listitem"
            title={`${MANA_INFO[color].name}: ${pool[color]}`}
            aria-label={`${MANA_INFO[color].name}: ${pool[color]}`}
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shadow-inner ${MANA_INFO[color].className} ${pool[color] === 0 ? 'opacity-40' : ''}`}
          >
            {pool[color]}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onNewTurn}
        className="mt-2 w-full text-[10px] font-bold uppercase tracking-widest text-stone-200 bg-black/40 hover:bg-black/70 border border-stone-600 rounded py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        New Turn
      </button>
    </div>
  );
}
