import React, { useEffect, useRef } from 'react';

// Design-space size of the hand drawing (SVG viewBox) and the rendered scale.
const VIEW_W = 56;
const VIEW_H = 64;
const SCALE = 0.9;

// Where the "hot spot" is in each pose: the fingertip when pointing, the pinch point when pinching.
// The hand is offset so this point sits exactly on the real pointer position.
const HOTSPOT_POINT = { x: 25, y: 5 };
const HOTSPOT_PINCH = { x: 17, y: 15 };

const SKIN = '#f3cba6';
const OUTLINE = '#4a2f1d';

/** A rounded "finger": a thick stroked path drawn over a slightly thicker dark one for the outline. */
const Finger = ({ d, width }) => (
  <>
    <path d={d} fill="none" stroke={OUTLINE} strokeWidth={width + 3.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={SKIN} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const PALM_PATH = 'M16 36 C16 31 20 29 24 29 L44 29 C48 29 50 32 50 36 L50 48 C50 57 44 62 36 62 L28 62 C20 62 16 56 16 48 Z';

/** Palm with the three curled fingers, shared by both poses. */
const Palm = () => (
  <>
    <Finger d="M31 33 L31 32" width={7} />
    <Finger d="M38 33 L38 32" width={7} />
    <Finger d="M45 34 L45 33" width={6.5} />
    <path d={PALM_PATH} fill={SKIN} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M34.5 31 L34.5 42 M41.5 31.5 L41.5 42" stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" fill="none" />
  </>
);

const PointingHand = () => (
  <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width={VIEW_W * SCALE} height={VIEW_H * SCALE} className="absolute top-0 left-0 overflow-visible">
    <Palm />
    <Finger d="M19 44 L10 35" width={8} />
    <Finger d="M25 34 L25 9" width={9} />
  </svg>
);

const PinchingHand = () => (
  <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width={VIEW_W * SCALE} height={VIEW_H * SCALE} className="absolute top-0 left-0 overflow-visible">
    <Palm />
    <Finger d="M19 46 Q10 44 11 32 Q11 22 17 16" width={8} />
    <Finger d="M25 34 L25 24 Q25 15 17 14" width={9} />
  </svg>
);

const isTextField = (el) => Boolean(el?.closest?.('input, textarea, select'));

/**
 * Custom cursor: a hand that points by default and pinches while a card is being held.
 * Tracks the pointer with refs + requestAnimationFrame (no React re-render per move) and tilts
 * slightly with horizontal speed. Only active for mouse/pen input; touch keeps its normal behavior.
 */
export default function HandCursor({ isPinching }) {
  const wrapRef = useRef(null);
  const state = useRef({ x: 0, y: 0, tilt: 0, lastX: 0, visible: false, down: false });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = state.current;
    let frame = 0;

    const show = (visible) => {
      s.visible = visible;
      if (wrapRef.current) wrapRef.current.style.opacity = visible ? '1' : '0';
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      s.x = e.clientX;
      s.y = e.clientY;
      document.body.classList.add('custom-cursor');
      show(!isTextField(e.target));
    };
    const onDown = () => { s.down = true; };
    const onUp = () => { s.down = false; };
    const onLeave = () => show(false);

    const tick = () => {
      const el = wrapRef.current;
      if (el) {
        // Ease the tilt toward a target based on how fast the pointer moved this frame.
        const speed = s.x - s.lastX;
        s.lastX = s.x;
        const target = reduceMotion ? 0 : Math.max(-14, Math.min(14, speed * 0.7));
        s.tilt += (target - s.tilt) * 0.2;
        el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.tilt.toFixed(2)}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  const hotspot = isPinching ? HOTSPOT_PINCH : HOTSPOT_POINT;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[1000] pointer-events-none opacity-0 transition-opacity duration-150"
      style={{ transformOrigin: '0 0', willChange: 'transform' }}
    >
      {/* Offset so the hot spot sits on the pointer; eases when switching between poses. */}
      <div
        className="relative transition-transform duration-100 ease-out"
        style={{
          width: VIEW_W * SCALE,
          height: VIEW_H * SCALE,
          transform: `translate(${-hotspot.x * SCALE}px, ${-hotspot.y * SCALE}px) scale(${isPinching ? 0.96 : 1})`,
          transformOrigin: `${hotspot.x * SCALE}px ${hotspot.y * SCALE}px`,
          filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.45))',
        }}
      >
        <div className="transition-opacity duration-100" style={{ opacity: isPinching ? 0 : 1 }}><PointingHand /></div>
        <div className="transition-opacity duration-100" style={{ opacity: isPinching ? 1 : 0 }}><PinchingHand /></div>
      </div>
    </div>
  );
}
