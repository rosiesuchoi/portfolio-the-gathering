import React, { useEffect, useRef, useState } from 'react';
import { getCardById } from '../../models/cards.js';
import HandCard from './HandCard.jsx';
import ManaPool from './ManaPool.jsx';

// Opening-hand "draw" animation timing.
const DRAW_BASE_DELAY_MS = 400;
const DRAW_STAGGER_MS = 150;
const DRAW_SETTLE_MS = 400;

export default function Hand({ cardIds, life, manaPool, onNewTurn, draggingId, onPointerDown, onMouseEnter, onMouseLeave }) {
  // Only the opening hand gets the staggered draw animation; once it settles, every card
  // that shows up in the hand is interactable immediately.
  const openingIds = useRef(cardIds);
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const total = DRAW_BASE_DELAY_MS + openingIds.current.length * DRAW_STAGGER_MS + DRAW_SETTLE_MS;
    const timer = setTimeout(() => setIntro(false), total);
    return () => clearTimeout(timer);
  }, []);

  const drawDelayFor = (cardId) => {
    const openingIndex = openingIds.current.indexOf(cardId);
    return intro && openingIndex !== -1 ? DRAW_BASE_DELAY_MS + openingIndex * DRAW_STAGGER_MS : 0;
  };

  return (
    <div className="h-32 md:h-48 relative z-30 w-full border-t border-stone-800 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2 md:pb-6 pointer-events-none">
      <div className="absolute left-4 bottom-2 hidden sm:flex flex-col gap-2 pointer-events-auto">
        <ManaPool pool={manaPool} onNewTurn={onNewTurn} />
        <div className="bg-stone-800 border border-stone-600 rounded p-2 text-center shadow-lg transition-all">
          <div className="text-[10px] font-sans text-stone-400 uppercase tracking-widest">Life</div>
          <div className={`text-2xl font-bold leading-none transition-colors duration-500 ${life < 40 ? 'text-red-500' : 'text-white'}`}>{life}</div>
        </div>
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
              drawDelay={drawDelayFor(card.id)}
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
