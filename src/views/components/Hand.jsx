import React from 'react';
import { getCardById } from '../../models/cards.js';
import HandCard from './HandCard.jsx';

export default function Hand({ cardIds, life, draggingId, onPointerDown, onMouseEnter, onMouseLeave }) {
  return (
    <div className="h-32 md:h-48 relative z-30 w-full border-t border-stone-800 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2 md:pb-6 pointer-events-none">
      <div className="absolute left-4 bottom-4 bg-stone-800 border border-stone-600 rounded p-2 text-center shadow-lg hidden sm:block pointer-events-auto transition-all">
        <div className="text-[10px] font-sans text-stone-400 uppercase tracking-widest">Life</div>
        <div className={`text-2xl font-bold leading-none transition-colors duration-500 ${life < 40 ? 'text-red-500' : 'text-white'}`}>{life}</div>
      </div>

      <div className="relative flex justify-center w-full max-w-4xl mx-auto perspective-[1200px] pointer-events-auto">
        {cardIds.map((cardId, index) => {
          const card = getCardById(cardId);
          return (
            <HandCard
              key={`hand-${card.id}`}
              card={card}
              index={index}
              total={cardIds.length}
              isDragging={draggingId === card.id}
              onPointerDown={onPointerDown}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          );
        })}
      </div>
    </div>
  );
}
