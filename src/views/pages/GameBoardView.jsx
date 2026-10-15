import React from 'react';
import { CARD_IDS, getCardById } from '../../models/cards.js';
import { COMMANDER_ZONE } from '../../models/gameModel.js';
import { getProject } from '../../models/projects.js';
import { computePreviewStyle } from '../utils/previewPosition.js';
import BoardCard from '../components/BoardCard.jsx';
import CardFace from '../components/CardFace.jsx';
import CommandZone from '../components/CommandZone.jsx';
import Graveyard from '../components/Graveyard.jsx';
import HandCursor from '../components/HandCursor.jsx';
import HintPopup from '../components/HintPopup.jsx';
import Hand from '../components/Hand.jsx';
import Library from '../components/Library.jsx';
import MTGCardPreview from '../components/MTGCardPreview.jsx';
import StackPanel from '../components/StackPanel.jsx';
import ThemeBackground from '../components/ThemeBackground.jsx';
import TopBar from '../components/TopBar.jsx';
import ContactModal from '../modals/ContactModal.jsx';
import HowToPlayModal from '../modals/HowToPlayModal.jsx';
import ProjectModal from '../modals/ProjectModal.jsx';
import ResumeModal from '../modals/ResumeModal.jsx';

/** Presentational layout of the whole game; all state and handlers come from the controller. */
export default function GameBoardView({ game }) {
  const {
    handIds, boardCards, graveyardIds, commander, manaPool, life, libraryCount, buffedIds,
    getStats, handleNewTurn, hint, closeHint,
    unlockedProjectIds, handleGraveyardActivate, parallaxRef, projectCardId, closeProject,
    stackItems, handleResolveStack,
    commanderCard, dragging, draggedCard,
    hoverState, previewCard, isPreviewVisible,
    activeTheme, setActiveTheme,
    showResumeModal, showContactScreen, showHowToPlay,
    closeResumeModal, closeContactScreen, openHowToPlay, closeHowToPlay, contactForm,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleMouseEnter, handleMouseLeave, cancelPreviewHide,
  } = game;

  const draggingId = dragging?.id;
  const previewStyle = computePreviewStyle(hoverState, isPreviewVisible);

  // "Examine" ability marker for project artifacts on the battlefield.
  const abilityFor = (cardId) => {
    const project = getProject(cardId);
    return project ? { color: project.abilityColor, unlocked: unlockedProjectIds.includes(cardId) } : null;
  };

  return (
    <div
      ref={parallaxRef}
      className="h-screen w-full bg-[#1a1c23] text-stone-200 overflow-hidden font-serif selection:bg-amber-500/30 flex flex-col relative"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <ThemeBackground activeTheme={activeTheme} />
      <HandCursor isPinching={Boolean(dragging)} />

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

      <TopBar
        activeTheme={activeTheme}
        onSelectTheme={setActiveTheme}
        onOpenHowToPlay={openHowToPlay}
      />

      <div className="flex-1 relative z-10 w-full h-full">
        <CommandZone
          card={commanderCard}
          inZone={commander.zone === COMMANDER_ZONE.COMMAND}
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
              isBuffed={buffedIds.includes(bc.id)}
              stats={getStats(bc.id)}
              ability={abilityFor(bc.id)}
            />
          );
        })}

        {commander.zone === COMMANDER_ZONE.BATTLEFIELD && (
          <BoardCard
            card={commanderCard}
            x={commander.x}
            y={commander.y}
            isDragging={draggingId === CARD_IDS.COMMANDER}
            onPointerDown={handlePointerDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isBuffed={buffedIds.includes(CARD_IDS.COMMANDER)}
            stats={getStats(CARD_IDS.COMMANDER)}
          />
        )}

        <div className="absolute right-4 top-4 z-20 flex flex-col gap-10 md:gap-14 items-center pointer-events-none">
          <Library count={libraryCount} />
          <Graveyard
            cardIds={graveyardIds}
            unlockedProjectIds={unlockedProjectIds}
            onActivate={handleGraveyardActivate}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>

      <StackPanel items={stackItems} onResolve={handleResolveStack} />

      <Hand
        cardIds={handIds}
        life={life}
        manaPool={manaPool}
        onNewTurn={handleNewTurn}
        draggingId={draggingId}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {hint && <HintPopup hint={hint} manaPool={manaPool} onClose={closeHint} />}

      {projectCardId && (
        <ProjectModal
          card={getCardById(projectCardId)}
          project={getProject(projectCardId)}
          onClose={closeProject}
        />
      )}

      {showResumeModal && <ResumeModal onClose={closeResumeModal} />}

      {showHowToPlay && <HowToPlayModal onClose={closeHowToPlay} />}

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
