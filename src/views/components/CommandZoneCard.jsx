import React from 'react';
import CardFace from './CardFace.jsx';

export default function CommandZoneCard({ card, isDragging, onPointerDown, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onPointerDown={(e) => onPointerDown(e, card.id, 'commander')}
      onMouseEnter={(e) => onMouseEnter(e, card.id, 'commander')}
      onMouseLeave={onMouseLeave}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      className="relative w-20 sm:w-24 md:w-28 aspect-[2.5/3.5] rounded-xl bg-black p-1 shadow-lg cursor-grab active:cursor-grabbing flex-shrink-0 border-2 border-stone-700 hover:border-amber-400 transition-all z-10 touch-none"
    >
      <CardFace card={card} />
    </div>
  );
}
