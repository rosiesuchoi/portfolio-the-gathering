import React from 'react';
import { IconBriefcase } from '../icons/Icons.jsx';

export default function ResumeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8" onPointerDown={onClose}>
      <div className="relative w-full max-w-4xl h-[85vh] bg-stone-900 border-[6px] border-[#c0c0c0] rounded-xl shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-[pulse_0.5s_ease-out_1]" onPointerDown={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-red-800 to-red-600 p-3 border-b-4 border-black flex justify-between items-center shadow-lg relative z-10">
          <h2 className="text-white font-serif font-bold text-lg md:text-xl tracking-wider flex items-center gap-2 drop-shadow-md">
            <IconBriefcase size={24} /> The Resume
          </h2>
          <button className="text-white hover:bg-white/20 hover:text-red-100 font-sans font-bold px-4 py-1.5 bg-black/40 rounded border border-black/50 transition-colors shadow-inner" onClick={onClose}>
            Close [X]
          </button>
        </div>
        <div className="flex-1 w-full overflow-auto bg-stone-300 p-4 text-center">
          <img src="Rosie_Choi.png" alt="Rosie Choi Resume" className="inline-block max-w-none shadow-2xl border border-stone-400" />
        </div>
      </div>
    </div>
  );
}
