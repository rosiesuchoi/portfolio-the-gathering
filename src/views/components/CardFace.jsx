import React from 'react';

/** Compact card face used on the battlefield, in the hand, graveyard and while dragging. */
export default function CardFace({ card }) {
  return (
    <div className={`relative h-full w-full rounded-[8px] border-[3px] md:border-[4px] ${card.borderColor} overflow-hidden bg-gradient-to-br ${card.color} flex flex-col pointer-events-none`}>
      <div className="mx-1 mt-1 bg-[#c9d8c9] border border-black/50 rounded shadow-sm px-1 py-0.5 flex justify-between items-center relative z-10">
        <div className="text-[6px] sm:text-[8px] md:text-[10px] font-bold text-black truncate pr-1">
          {card.title}
        </div>
        {card.cost && (
          <div className={`text-[6px] sm:text-[8px] font-bold px-1 rounded-full border border-black/25 shadow-inner ${card.manaColor}`}>
            {card.cost}
          </div>
        )}
      </div>

      <div className="mx-1 mt-1 bg-[#c9d8c9] border border-black/50 rounded shadow-sm px-1 flex items-center relative z-10">
        <span className="text-[5px] sm:text-[7px] md:text-[8px] font-bold text-black truncate">{card.type}</span>
      </div>

      <div className="mx-1 my-1 flex-1 bg-[#f0f0f0]/90 border border-black/50 rounded p-1 shadow-inner relative z-10 opacity-70"></div>
    </div>
  );
}
