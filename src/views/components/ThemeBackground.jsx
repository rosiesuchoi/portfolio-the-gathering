import React from 'react';
import { THEMES } from '../../models/themes.js';

/**
 * Full-bleed background. Gradients can't be transitioned in CSS, so every theme
 * is rendered as its own layer and the active one is cross-faded in via opacity.
 *
 * Parallax: the theme layers drift opposite the mouse, and two soft light blobs sit on
 * nearer "depth planes" that drift further, which gives the table a sense of depth.
 * (--mx / --my come from useMouseParallax; they default to 0 when unset.)
 */
export default function ThemeBackground({ activeTheme }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {THEMES.map(theme => (
        <div
          key={theme.id}
          className="absolute -inset-10 transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
          style={{
            ...theme.background,
            opacity: theme.id === activeTheme ? 1 : 0,
            transform: 'translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px), 0)',
          }}
        />
      ))}

      {/* Nearer depth planes: soft light and shade blobs that move more than the backdrop */}
      <div
        className="absolute -left-[10vmax] -top-[10vmax] h-[55vmax] w-[55vmax] rounded-full bg-white/15 blur-3xl"
        style={{ transform: 'translate3d(calc(var(--mx, 0) * -45px), calc(var(--my, 0) * -35px), 0)' }}
      />
      <div
        className="absolute -bottom-[15vmax] -right-[10vmax] h-[60vmax] w-[60vmax] rounded-full bg-black/30 blur-3xl"
        style={{ transform: 'translate3d(calc(var(--mx, 0) * 60px), calc(var(--my, 0) * 40px), 0)' }}
      />
    </div>
  );
}
