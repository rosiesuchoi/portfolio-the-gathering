import React from 'react';
import { IconHelp } from '../icons/Icons.jsx';
import ThemeSwitcher from './ThemeSwitcher.jsx';

export default function TopBar({ activeTheme, onSelectTheme, onOpenHowToPlay }) {
  return (
    <div className="relative z-30 w-full bg-black/60 border-b border-stone-700 p-2 flex justify-between items-center h-16 pointer-events-none">
      <div className="flex items-center gap-4 h-full pointer-events-auto">
        <ThemeSwitcher activeTheme={activeTheme} onSelect={onSelectTheme} />
      </div>

      <div className="flex items-center h-full pointer-events-auto">
        <button
          type="button"
          onClick={onOpenHowToPlay}
          className="flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white font-sans font-bold text-sm px-4 py-1.5 rounded-full border border-stone-500 shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <IconHelp size={18} /> How to Play
        </button>
      </div>
    </div>
  );
}
