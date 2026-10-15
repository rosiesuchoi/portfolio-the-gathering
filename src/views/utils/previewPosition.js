const PREVIEW_WIDTH = 320;
const PREVIEW_HEIGHT = 448;

/**
 * Fixed-position style for the large hover preview: centered above hand cards,
 * floating beside battlefield/commander cards, always kept on-screen.
 */
export function computePreviewStyle(hoverState, isVisible) {
  const style = {
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
    position: 'fixed',
    zIndex: 100,
    transition: 'opacity 0.2s ease-in-out'
  };

  if (!hoverState || !isVisible) return style;

  const { rect, source } = hoverState;

  if (source === 'hand') {
    const cardCenterX = rect.left + rect.width / 2;
    const safeLeft = Math.max(PREVIEW_WIDTH / 2 + 10, Math.min(cardCenterX, window.innerWidth - PREVIEW_WIDTH / 2 - 10));
    style.left = safeLeft;
    style.bottom = window.innerHeight - rect.top + 10;
    style.transform = 'translate(-50%, 0)';
  } else {
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;

    if (spaceRight >= spaceLeft) {
      style.left = Math.min(rect.right + 20, window.innerWidth - PREVIEW_WIDTH - 10);
    } else {
      style.left = Math.max(10, rect.left - PREVIEW_WIDTH - 20);
    }

    const cardCenterY = rect.top + rect.height / 2;
    const topPos = cardCenterY - PREVIEW_HEIGHT / 2;
    style.top = Math.max(10, Math.min(topPos, window.innerHeight - PREVIEW_HEIGHT - 10));
  }

  return style;
}
