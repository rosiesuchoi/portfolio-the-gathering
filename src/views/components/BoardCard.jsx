import React from 'react';
import { CARD_IDS } from '../../models/cards.js';
import { MANA_INFO } from '../../models/manaModel.js';
import CardFace from './CardFace.jsx';

// 3D tilt that follows the mouse (--mx / --my are published by useMouseParallax on the app root).
const PARALLAX_TILT = 'perspective(700px) rotateX(calc(var(--my, 0) * -5deg)) rotateY(calc(var(--mx, 0) * 5deg))';

/**
 * A permanent on the battlefield. `stats` is the live power/toughness (see getBattlefieldStats).
 * `ability` ({ color, unlocked }) marks a project artifact with an "Examine" ability.
 */
export default function BoardCard({ card, x, y, isDragging, isTapped, onPointerDown, onMouseEnter, onMouseLeave, isBuffed, stats, ability }) {
  return (
    <div
      onPointerDown={(e) => onPointerDown(e, card.id, card.id === CARD_IDS.COMMANDER ? 'commander' : 'board')}
      onMouseEnter={(e) => onMouseEnter(e, card.id, 'board')}
      onMouseLeave={onMouseLeave}
      style={{ left: x, top: y, opacity: isDragging ? 0.3 : 1, position: 'fixed' }}
      className={`w-20 sm:w-28 md:w-36 aspect-[2.5/3.5] rounded-xl bg-black p-1 shadow-xl cursor-grab active:cursor-grabbing transition-transform duration-150 origin-center z-20 touch-none ${isTapped ? 'rotate-90' : 'rotate-0'} ${!isDragging ? 'hover:scale-105 hover:z-30' : ''}`}
    >
      {/* K-Beauty Matcher buff bubble: shown once its trigger has resolved for this creature */}
      {isBuffed && (
        <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-pink-500 text-white text-[8px] sm:text-[10px] md:text-[11px] font-bold px-2 py-0.5 sm:py-1 rounded-full shadow-lg border-2 border-white z-50 animate-bounce pointer-events-none whitespace-nowrap">
          +1/+1 🛡️ Hexproof
        </div>
      )}

      <div className="h-full w-full" style={{ transform: PARALLAX_TILT }}>
        <CardFace card={card} />
      </div>

      {/* Project artifact ability: pay this color to examine (then it just says "Open") */}
      {ability && (
        <div
          title={ability.unlocked ? 'Examined: click to reopen the project' : `Tap and pay ${MANA_INFO[ability.color].name.toLowerCase()} mana to examine this artifact`}
          className="absolute -top-2 -left-2 z-40 pointer-events-none flex items-center gap-1 rounded-full border-2 border-black bg-stone-100 pl-0.5 pr-1.5 py-0.5 font-sans font-bold text-[8px] sm:text-[9px] md:text-[10px] text-black shadow-lg"
        >
          {ability.unlocked ? (
            <span>Open ↗</span>
          ) : (
            <>
              <span className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border flex items-center justify-center ${MANA_INFO[ability.color].className}`}>{ability.color}</span>
              <span>Examine</span>
            </>
          )}
        </div>
      )}

      {/* Live power/toughness; green when raised by Jodah or a K-Beauty counter */}
      {stats && (
        <div
          title={`Base ${stats.base}${stats.jodahBonus ? `, +${stats.jodahBonus}/+${stats.jodahBonus} from Jodah` : ''}${stats.counters ? ', +1/+1 counter' : ''}`}
          className={`absolute -bottom-2 -right-2 z-40 pointer-events-none px-1.5 py-0.5 rounded border-2 border-black font-sans font-bold text-[9px] sm:text-[11px] md:text-xs shadow-lg ${stats.modified ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-black'}`}
        >
          {stats.label}
        </div>
      )}

      {!isDragging && (
        <div className="absolute -inset-2 border-2 border-transparent hover:border-[#D4AF37]/50 rounded-[14px] pointer-events-none transition-colors" />
      )}
    </div>
  );
}
