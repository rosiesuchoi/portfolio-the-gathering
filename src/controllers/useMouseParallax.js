import { useEffect, useRef } from 'react';

const SMOOTHING = 0.1;
const EPSILON = 0.001;

/**
 * Publishes the mouse position as two CSS custom properties on the returned ref's element:
 *   --mx / --my : -1 (left / top edge) to 1 (right / bottom edge), smoothed.
 * Views use them in CSS (e.g. `rotateY(calc(var(--mx, 0) * 5deg))`) for 3D parallax without
 * re-rendering React on every mouse move. Does nothing when the user prefers reduced motion.
 */
export function useMouseParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0;

    const tick = () => {
      currentX += (targetX - currentX) * SMOOTHING;
      currentY += (targetY - currentY) * SMOOTHING;
      el.style.setProperty('--mx', currentX.toFixed(3));
      el.style.setProperty('--my', currentY.toFixed(3));
      const settled = Math.abs(targetX - currentX) < EPSILON && Math.abs(targetY - currentY) < EPSILON;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      schedule();
    };
    // Ease back to center when the mouse leaves the window.
    const onLeave = () => { targetX = 0; targetY = 0; schedule(); };

    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
