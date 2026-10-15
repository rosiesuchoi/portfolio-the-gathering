import React from 'react';

export default function Library({ count }) {
  return (
    <div className="w-20 sm:w-28 md:w-36 aspect-[2.5/3.5] group pointer-events-auto cursor-pointer relative">
      <div id="visual-deck" className="relative w-full h-full group-hover:-translate-y-1 transition-transform duration-300 ease-out origin-center">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="absolute inset-0 bg-[#000000] rounded-[6px] md:rounded-[12px] shadow-[2px_2px_8px_rgba(0,0,0,0.8)] overflow-hidden" style={{ transform: `translate(${i * 1.5}px, -${i * 1.5}px)` }}>
            <img src="back.jpg" alt="Magic Card Back" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 bg-black/90 px-3 py-1 rounded border border-stone-700 text-[9px] md:text-[11px] text-stone-300 font-sans tracking-widest uppercase shadow-lg text-center whitespace-nowrap">
        Library ({count})
      </div>
    </div>
  );
}
