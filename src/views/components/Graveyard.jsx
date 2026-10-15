import React from 'react';
import { GRAVEYARD_ZONE_ID } from '../../constants.js';
import { getCardById } from '../../models/cards.js';
import CardFace from './CardFace.jsx';

export default function Graveyard({ cardIds, onMouseEnter, onMouseLeave }) {
  const topCardId = cardIds[cardIds.length - 1];

  return (
    <div id={GRAVEYARD_ZONE_ID} className="w-20 sm:w-28 md:w-36 aspect-[2.5/3.5] pointer-events-auto relative group">
      <div className="w-full h-full border-2 border-dashed border-stone-600 bg-black/70 backdrop-blur-sm rounded-xl p-1 flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] transition-colors hover:border-stone-400">
        {cardIds.length === 0 ? (
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold drop-shadow-md text-center">Graveyard</div>
        ) : (
          <div
            className="w-full h-full relative"
            onMouseEnter={(e) => onMouseEnter(e, topCardId, 'graveyard')}
            onMouseLeave={onMouseLeave}
          >
            <CardFace card={getCardById(topCardId)} />
            <div className="absolute -inset-1 border-2 border-transparent group-hover:border-stone-400/50 rounded-[10px] pointer-events-none transition-colors" />
          </div>
        )}
      </div>
      {cardIds.length > 0 && (
        <div className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 bg-black/90 px-3 py-1 rounded border border-stone-700 text-[9px] md:text-[11px] text-stone-300 font-sans tracking-widest uppercase shadow-lg text-center whitespace-nowrap">
          Graveyard ({cardIds.length})
        </div>
      )}
    </div>
  );
}
