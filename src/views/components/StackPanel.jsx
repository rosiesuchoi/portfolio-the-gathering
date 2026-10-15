import React, { useState } from 'react';
import { STACK_ITEM_KIND } from '../../models/stackModel.js';
import { IconLayers } from '../icons/Icons.jsx';

const KIND_BADGE = {
  [STACK_ITEM_KIND.SPELL]: { label: 'Spell', className: 'bg-amber-200 text-amber-900' },
  [STACK_ITEM_KIND.TRIGGER]: { label: 'Trigger', className: 'bg-sky-200 text-sky-900' },
};

/**
 * Floating overlay showing The Stack. Items are listed top first: the top item
 * resolves next (last in, first out) when "Resolve" is pressed.
 */
export default function StackPanel({ items, onResolve }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="The Stack"
      className="fixed z-40 top-[72px] right-[112px] sm:right-[144px] md:right-[176px] w-52 md:w-64 bg-black/85 backdrop-blur-sm border border-stone-500 rounded-xl shadow-2xl font-sans text-stone-100 pointer-events-auto"
    >
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest">
          <IconLayers size={16} /> The Stack ({items.length})
        </span>
        <span className="text-xs text-stone-300">{collapsed ? 'Show' : 'Hide'}</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          <p className="text-[10px] md:text-[11px] text-stone-300 leading-snug">
            Last in, first out: the top item resolves first.
          </p>

          <ol aria-live="polite" className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
            {items.length === 0 && (
              <li className="text-xs text-stone-400 italic border border-dashed border-stone-600 rounded p-2">
                Empty. Drag a card from your hand onto the battlefield to put it on the stack.
              </li>
            )}
            {items.map((item, index) => {
              const badge = KIND_BADGE[item.kind];
              return (
                <li
                  key={item.id}
                  className={`rounded border p-2 ${index === 0 ? 'border-amber-300 bg-stone-800' : 'border-stone-600 bg-stone-900'}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold truncate">{item.title}</span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${badge.className}`}>{badge.label}</span>
                  </div>
                  {index === 0 && (
                    <div className="text-[9px] uppercase tracking-widest text-amber-300 mb-1">Resolves next</div>
                  )}
                  <p className="text-[11px] text-stone-300 leading-snug line-clamp-3">{item.text}</p>
                </li>
              );
            })}
          </ol>

          <button
            type="button"
            onClick={onResolve}
            disabled={items.length === 0}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-sm rounded shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Resolve Top Item
          </button>
        </div>
      )}
    </aside>
  );
}
