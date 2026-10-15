import React from 'react';
import { CARD_IDS, getCardById } from '../../models/cards.js';
import { computePreviewStyle } from '../utils/previewPosition.js';
import BoardCard from '../components/BoardCard.jsx';
import CardFace from '../components/CardFace.jsx';
import CommandZone from '../components/CommandZone.jsx';
import Graveyard from '../components/Graveyard.jsx';
import Hand from '../components/Hand.jsx';
import Library from '../components/Library.jsx';
import MTGCardPreview from '../components/MTGCardPreview.jsx';
import TopBar from '../components/TopBar.jsx';
import ContactModal from '../modals/ContactModal.jsx';
import ResumeModal from '../modals/ResumeModal.jsx';

/** Presentational layout of the whole game; all state and handlers come from the controller. */
export default function GameBoardView({ game }) {
  const {
    handIds, boardCards, graveyardIds, commander, life, libraryCount, isKBeautyActive,
    commanderCard, dragging, draggedCard,
    hoverState, previewCard, isPreviewVisible,
    showResumeModal, showContactScreen, closeResumeModal, closeContactScreen, contactForm,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleMouseEnter, handleMouseLeave, cancelPreviewHide,
  } = game;

  const draggingId = dragging?.id;
  const previewStyle = computePreviewStyle(hoverState, isPreviewVisible);

  return (
    <div
      className="h-screen w-full bg-gradient-to-b from-[#1a1c23] to-[#2a2d36] text-stone-200 overflow-hidden font-serif selection:bg-amber-500/30 flex flex-col relative"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        style={previewStyle}
        onMouseEnter={cancelPreviewHide}
        onMouseLeave={handleMouseLeave}
      >
        {previewCard && <MTGCardPreview card={previewCard} />}
      </div>

      {dragging && draggedCard && (
        <div className="fixed pointer-events-none z-[110] w-20 sm:w-28 md:w-36 aspect-[2.5/3.5] rounded-xl bg-black p-1 shadow-2xl" style={{ left: dragging.x, top: dragging.y }}>
          <CardFace card={draggedCard} />
        </div>
      )}

      <TopBar />

      <div className="flex-1 relative z-10 w-full h-full">
        <CommandZone
          card={commanderCard}
          inZone={commander.inZone}
          isDragging={draggingId === CARD_IDS.COMMANDER}
          onPointerDown={handlePointerDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        {boardCards.map(bc => {
          const card = getCardById(bc.id);
          if (!card) return null;
          return (
            <BoardCard
              key={`board-${bc.id}`}
              card={card}
              x={bc.x}
              y={bc.y}
              isTapped={bc.tapped}
              isDragging={draggingId === bc.id}
              onPointerDown={handlePointerDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              isKBeautyActive={isKBeautyActive}
            />
          );
        })}

        {!commander.inZone && (
          <BoardCard
            card={commanderCard}
            x={commander.x}
            y={commander.y}
            isDragging={draggingId === CARD_IDS.COMMANDER}
            onPointerDown={handlePointerDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isKBeautyActive={isKBeautyActive}
          />
        )}

        <div className="absolute right-4 top-4 z-20 flex flex-col gap-10 md:gap-14 items-center pointer-events-none">
          <Library count={libraryCount} />
          <Graveyard
            cardIds={graveyardIds}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>

      <Hand
        cardIds={handIds}
        life={life}
        draggingId={draggingId}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {showResumeModal && <ResumeModal onClose={closeResumeModal} />}

      {showContactScreen && (
        <ContactModal
          formStatus={contactForm.formStatus}
          onSubmit={contactForm.handleSubmit}
          onClose={closeContactScreen}
        />
      )}
    </div>
  );
}
