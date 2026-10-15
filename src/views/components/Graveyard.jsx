import React from 'react';
import { GRAVEYARD_ZONE_ID } from '../../constants.js';
import { getCardById } from '../../models/cards.js';
import { isInstantOrSorcery } from '../../models/gameModel.js';
import { MANA_INFO } from '../../models/manaModel.js';
import { getProject } from '../../models/projects.js';
import CardFace from './CardFace.jsx';

/**
 * Graveyard pile. If the top card is a project that is a spell (Portfolio Site), it has a
 * graveyard version of the Examine ability: clicking the card activates it.
 */
export default function Graveyard({ cardIds, unlockedProjectIds, onActivate, onMouseEnter, onMouseLeave }) {
  const topCardId = cardIds[cardIds.length - 1];
  const topCard = topCardId ? getCardById(topCardId) : null;
  const project = topCard && isInstantOrSorcery(topCard) ? getProject(topCardId) : null;
  const unlocked = project ? unlockedProjectIds.includes(topCardId) : false;

  return (
    <div id={GRAVEYARD_ZONE_ID} className="w-20 sm:w-28 md:w-36 aspect-[2.5/3.5] pointer-events-auto relative group">
      <div className="w-full h-full border-2 border-dashed border-stone-600 bg-black/70 backdrop-blur-sm rounded-xl p-1 flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] transition-colors hover:border-stone-400">
        {cardIds.length === 0 ? (
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold drop-shadow-md text-center">Graveyard</div>
        ) : (
          <div
            className={`w-full h-full relative ${project ? 'cursor-pointer' : ''}`}
            onMouseEnter={(e) => onMouseEnter(e, topCardId, 'graveyard')}
            onMouseLeave={onMouseLeave}
            onClick={project ? () => onActivate(topCardId) : undefined}
            role={project ? 'button' : undefined}
            aria-label={project ? `Examine ${topCard.title}` : undefined}
          >
            <CardFace card={topCard} />
            <div className="absolute -inset-1 border-2 border-transparent group-hover:border-stone-400/50 rounded-[10px] pointer-events-none transition-colors" />

            {project && (
              <div className="absolute -top-2 -left-2 z-40 pointer-events-none flex items-center gap-1 rounded-full border-2 border-black bg-stone-100 pl-0.5 pr-1.5 py-0.5 font-sans font-bold text-[8px] sm:text-[9px] md:text-[10px] text-black shadow-lg">
                {unlocked ? (
                  <span>Open ↗</span>
                ) : (
                  <>
                    <span className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border flex items-center justify-center ${MANA_INFO[project.abilityColor].className}`}>{project.abilityColor}</span>
                    <span>Examine</span>
                  </>
                )}
              </div>
            )}
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
