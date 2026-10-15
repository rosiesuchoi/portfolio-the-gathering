import React, { useEffect, useState } from 'react';
import { getIcon, IconCode } from '../icons/Icons.jsx';

const MAX_TILT_DEG = 10;

const hostOf = (url) => {
  try { return new URL(url).host; } catch { return url; }
};

/** Placeholder site layout, tinted with the card's colors, used until a real screenshot is provided. */
function MockScreen({ card }) {
  const Icon = getIcon(card.icon);
  return (
    <div className={`relative h-full w-full bg-gradient-to-br ${card.color} p-4 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-white/70" />
        <div className="flex gap-2">
          <div className="h-2.5 w-10 rounded bg-white/50" />
          <div className="h-2.5 w-10 rounded bg-white/50" />
          <div className="h-2.5 w-10 rounded bg-white/50" />
        </div>
      </div>
      <div className="flex-1 flex items-center gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 w-3/4 rounded bg-white/80" />
          <div className="h-3 w-full rounded bg-white/50" />
          <div className="h-3 w-5/6 rounded bg-white/50" />
          <div className="mt-2 h-7 w-24 rounded-full bg-white/80" />
        </div>
        <div className="w-1/3 aspect-square rounded-xl bg-black/30 border border-white/30 flex items-center justify-center">
          {Icon && <Icon size={48} className="text-white drop-shadow-lg" />}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-10 rounded bg-black/25" />
        <div className="h-10 rounded bg-black/25" />
        <div className="h-10 rounded bg-black/25" />
      </div>
    </div>
  );
}

/**
 * Browser-window mock of the project that tilts in 3D with the mouse. If the project has a live
 * URL the whole picture is a link to the real site; otherwise it shows a "coming soon" badge.
 */
function SiteMock({ card, project }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 2 * MAX_TILT_DEG, y: px * 2 * MAX_TILT_DEG });
  };
  const handleMouseLeave = () => { setTilt({ x: 0, y: 0 }); setHovering(false); };

  const frame = (
    <div
      className="relative rounded-lg border border-stone-700 bg-stone-900 shadow-[0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.4s ease-out' : 'transform 0.08s linear',
      }}
    >
      {/* Browser chrome, floated slightly above the page */}
      <div className="flex items-center gap-2 bg-stone-800 px-3 py-2" style={{ transform: 'translateZ(14px)' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="ml-2 flex-1 truncate rounded bg-stone-950 px-3 py-0.5 text-[11px] text-stone-300 font-sans">
          {project.liveUrl ? hostOf(project.liveUrl) : 'not-deployed-yet'}
        </div>
      </div>

      <div className="relative aspect-[16/10] bg-stone-950">
        {project.screenshot
          ? <img src={project.screenshot} alt={`${card.title} screenshot`} className="h-full w-full object-cover object-top" />
          : <MockScreen card={card} />}

        {/* Floating call-to-action layer */}
        <div className="absolute inset-0 flex items-end justify-center p-3 pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
          {project.liveUrl ? (
            <span className={`rounded-full bg-black/80 px-4 py-1.5 text-xs font-bold text-white font-sans shadow-lg transition-opacity ${hovering ? 'opacity-100' : 'opacity-80'}`}>
              Visit the live site ↗
            </span>
          ) : (
            <span className="rounded-full bg-black/75 px-4 py-1.5 text-xs font-bold text-amber-200 font-sans shadow-lg">
              Live link coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{ perspective: '1100px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the live ${card.title} site in a new tab`}
          className="block rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
        >
          {frame}
        </a>
      ) : frame}
    </div>
  );
}

/** Details for a project artifact: site mock, stack, description and links. */
export default function ProjectModal({ card, project, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const Icon = getIcon(card.icon);

  return (
    <div className="fixed inset-0 z-[220] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8" onPointerDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="relative w-full max-w-5xl max-h-[90vh] bg-stone-100 border-[6px] border-[#D4AF37] rounded-xl shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
        onPointerDown={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-r ${card.color} p-3 border-b-4 border-black flex justify-between items-center shadow-lg`}>
          <h2 id="project-title" className="text-white font-serif font-bold text-lg md:text-xl tracking-wider flex items-center gap-2 drop-shadow-md">
            {Icon && <Icon size={24} />} {card.title}
            <span className="ml-2 text-xs font-sans font-bold uppercase tracking-widest bg-black/40 rounded px-2 py-0.5">Artifact {project.artifactNumber}</span>
          </h2>
          <button
            type="button"
            className="text-white hover:bg-white/20 font-sans font-bold px-4 py-1.5 bg-black/40 rounded border border-black/50 transition-colors shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={onClose}
          >
            Close [X]
          </button>
        </div>

        <div className="overflow-y-auto p-5 md:p-7 grid md:grid-cols-2 gap-6 md:gap-8 font-sans text-stone-800">
          <div className="flex flex-col justify-center gap-3">
            <SiteMock card={card} project={project} />
            <p className="text-xs text-stone-500 text-center">
              {project.liveUrl ? 'Click the picture to open the live site.' : 'Move your mouse over the preview to tilt it.'}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-900 mb-1">What it is</h3>
              <p className="text-base leading-relaxed">{project.summary}</p>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-900 mb-2">Built with</h3>
              {project.stack.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <li key={tech} className="rounded-full bg-stone-800 text-amber-100 px-3 py-1 text-xs font-bold">{tech}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-stone-500">Tech stack details coming soon.</p>
              )}
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-900 mb-1">The details</h3>
              {project.details.length > 0 ? (
                <div className="flex flex-col gap-2 text-sm md:text-base leading-relaxed">
                  {project.details.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                </div>
              ) : (
                <p className="text-sm italic text-stone-500">A full write-up of this project is coming soon.</p>
              )}
            </section>

            <section className="flex flex-wrap gap-3 pt-1">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm rounded shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900">
                  Visit live site ↗
                </a>
              ) : (
                <span className="px-4 py-2 bg-stone-300 text-stone-600 font-bold text-sm rounded cursor-not-allowed">Not deployed yet</span>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-sm rounded shadow transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-950">
                  <IconCode size={16} /> View source
                </a>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
