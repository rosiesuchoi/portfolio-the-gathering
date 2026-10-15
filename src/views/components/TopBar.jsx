import React from 'react';

export default function TopBar() {
  return (
    <div className="relative z-30 w-full bg-black/40 border-b border-stone-800 p-2 flex justify-between items-center h-16 pointer-events-none">
      <div className="flex items-center gap-4 h-full pointer-events-auto">
        <div className="flex gap-2 items-center bg-black/60 px-3 py-1.5 rounded-full border border-stone-700 shadow-md">
          <div className="w-3 h-3 rounded-full bg-yellow-100 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]"></div>
          <div className="w-3 h-3 rounded-full bg-stone-800 border border-stone-500 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]"></div>
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]"></div>
          <div className="w-3 h-3 rounded-full bg-green-600 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]"></div>
        </div>
      </div>
    </div>
  );
}
