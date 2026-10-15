import React from 'react';
import { IconUser } from '../icons/Icons.jsx';
import CommandZoneCard from './CommandZoneCard.jsx';

export default function CommandZone({ card, inZone, isDragging, onPointerDown, onMouseEnter, onMouseLeave }) {
  return (
    <div className="absolute top-4 left-4 z-20 pointer-events-auto">
      <div className="border-2 border-dashed border-[#D4AF37]/60 bg-black/40 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] transition-colors hover:border-[#D4AF37]/90 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] min-h-[160px] md:min-h-[200px]">
        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-3 drop-shadow-md">Command Zone</div>
        {inZone ? (
          <CommandZoneCard
            card={card}
            isDragging={isDragging}
            onPointerDown={onPointerDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        ) : (
          <div className="w-20 sm:w-24 md:w-28 aspect-[2.5/3.5] border-2 border-transparent border-dashed rounded-lg opacity-30 flex items-center justify-center pointer-events-none">
            <IconUser className="text-[#D4AF37]/50 w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
}
