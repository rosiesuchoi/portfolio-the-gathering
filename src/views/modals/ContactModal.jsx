import React from 'react';
import { IconBriefcase, IconCode, IconMail } from '../icons/Icons.jsx';

const INPUT_CLASS = "w-full p-2.5 border border-stone-400 rounded bg-white text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600";

const STATUS_CLASS = {
  success: 'bg-green-100 text-green-800 border border-green-300',
  error: 'bg-red-100 text-red-800 border border-red-300',
  loading: 'bg-blue-100 text-blue-800 border border-blue-300',
};

export default function ContactModal({ formStatus, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8" onPointerDown={onClose}>
      <div className="relative w-full max-w-2xl bg-stone-200 border-[6px] border-[#D4AF37] rounded-xl shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-[pulse_0.5s_ease-out_1]" onPointerDown={e => e.stopPropagation()}>

        <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-3 border-b-4 border-black flex justify-between items-center shadow-lg relative z-10">
          <h2 className="text-white font-serif font-bold text-lg md:text-xl tracking-wider flex items-center gap-2 drop-shadow-md">
            <IconMail size={24} /> Let's Connect!
          </h2>
          <button className="text-white hover:bg-white/20 hover:text-amber-100 font-sans font-bold px-4 py-1.5 bg-black/40 rounded border border-black/50 transition-colors shadow-inner" onClick={onClose}>
            Close [X]
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-amber-900 text-center mb-1">
            Puzzle Solved!
          </h1>
          <p className="text-sm md:text-base font-sans text-stone-700 text-center mb-6 border-b border-stone-300 pb-4">
            You successfully navigated the graveyard and demonstrated a mastery of state management and UI interactions. Send me a message directly using the form below!
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 font-sans w-full">
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value="New Portfolio Puzzle Submission!" />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Your Name</label>
              <input type="text" name="name" required className={INPUT_CLASS} placeholder="Jace Beleren" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Your Email</label>
              <input type="email" name="email" required className={INPUT_CLASS} placeholder="jace@ravnica.com" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Message</label>
              <textarea name="message" required rows="4" className={`${INPUT_CLASS} resize-none`} placeholder="I loved your interactive portfolio! Let's schedule an interview..."></textarea>
            </div>

            {formStatus.message && (
              <div className={`p-3 rounded text-sm font-bold text-center ${STATUS_CLASS[formStatus.status]}`}>
                {formStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus.status === 'loading'}
              className="w-full py-3 mt-2 bg-amber-700 hover:bg-amber-800 text-white font-bold font-sans rounded shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <IconMail size={18} /> {formStatus.status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="mt-6 flex flex-row justify-center gap-4 border-t border-stone-300 pt-6">
            <a href="https://linkedin.com/in/rosiesuchoi" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-700 text-white font-bold font-sans rounded shadow hover:scale-105 transition-transform flex items-center gap-2 text-sm">
              <IconBriefcase size={16} /> LinkedIn
            </a>
            <a href="https://github.com/rosiesuchoi" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-stone-700 text-white font-bold font-sans rounded shadow hover:scale-105 transition-transform flex items-center gap-2 text-sm">
              <IconCode size={16} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
