import React from 'react';
import { THEMES } from '../../models/themes.js';
import { getIcon } from '../icons/Icons.jsx';

/** Row of the five mana colors (WUBRG); clicking one switches the app theme. */
export default function ThemeSwitcher({ activeTheme, onSelect }) {
  return (
    <div
      role="group"
      aria-label="Background theme"
      className="flex gap-2 items-center bg-black/70 px-3 py-1.5 rounded-full border border-stone-600 shadow-md"
    >
      {THEMES.map(theme => {
        const Icon = getIcon(theme.icon);
        const isActive = theme.id === activeTheme;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            aria-pressed={isActive}
            aria-label={`${theme.manaName} - ${theme.name} theme`}
            title={`${theme.name} (${theme.manaName})`}
            className={`w-7 h-7 rounded-full flex items-center justify-center border border-black/40 shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${theme.buttonClass} ${isActive ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'}`}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
