import { useRef, useState } from 'react';
import { getCardById } from '../models/cards.js';

const HIDE_DELAY_MS = 100;

/**
 * Controller for the large card preview. Tracks which card is hovered and where,
 * with a short hide delay so the pointer can travel onto the preview itself.
 */
export function useHoverPreview() {
  const [hoverState, setHoverState] = useState(null);
  const hideTimeoutRef = useRef(null);

  const cancelHide = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  const handleMouseEnter = (e, id, source) => {
    // Ignore hover effects completely for basic lands to reduce visual clutter.
    const card = getCardById(id);
    if (card && card.rarity === 'Basic Land') return;

    cancelHide();
    setHoverState({ id, source, rect: e.currentTarget.getBoundingClientRect() });
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setHoverState(null), HIDE_DELAY_MS);
  };

  const clearHover = () => {
    cancelHide();
    setHoverState(null);
  };

  return { hoverState, handleMouseEnter, handleMouseLeave, cancelHide, clearHover };
}
