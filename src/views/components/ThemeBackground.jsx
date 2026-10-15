import React from 'react';
import { THEMES } from '../../models/themes.js';

/**
 * Full-bleed background. Gradients can't be transitioned in CSS, so every theme
 * is rendered as its own layer and the active one is cross-faded in via opacity.
 */
export default function ThemeBackground({ activeTheme }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      {THEMES.map(theme => (
        <div
          key={theme.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
          style={{ ...theme.background, opacity: theme.id === activeTheme ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
