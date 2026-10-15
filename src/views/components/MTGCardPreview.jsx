import React, { useRef, useState } from 'react';
import { getIcon, IconSparkles, StarShooting } from '../icons/Icons.jsx';

const NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

const RARITY_COLOR = {
  Mythic: 'bg-[#D4AF37]',
  Rare: 'bg-[#c0c0c0]',
  Uncommon: 'bg-[#718096]',
};

/** Large, 3D-tilting full card shown while hovering a card. */
export default function MTGCardPreview({ card }) {
  const IconComp = getIcon(card.icon);
  const previewRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  // Mouse position over the card in percent, for the moving glare highlight (null = not hovering).
  const [glare, setGlare] = useState(null);

  const handleMouseMove = (e) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const multiplier = 15; // Max 3D rotation degrees
    setTilt({
      x: (y / (rect.height / 2)) * -multiplier,
      y: (x / (rect.width / 2)) * multiplier
    });
    setGlare({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare(null);
  };

  return (
    <div
      className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px] flex-shrink-0 perspective-[1000px] group mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={previewRef}
        className="relative w-full aspect-[2.5/3.5] rounded-[20px] bg-black p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] preserve-3d"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className={`relative h-full w-full bg-gradient-to-br ${card.color} rounded-[12px] border-4 ${card.borderColor} flex flex-col overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: NOISE_TEXTURE }} />

          {/* Glare that follows the mouse, like light catching a foil card */}
          <div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-soft-light transition-opacity duration-200"
            style={{
              opacity: glare ? 1 : 0,
              backgroundImage: glare ? `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.75), transparent 55%)` : 'none',
            }}
          />

          <div className="mx-2 mt-2 bg-gradient-to-b from-[#e3e8e3] to-[#c9d8c9] border-2 border-black/60 rounded-[4px] px-2 py-1 flex justify-between items-center shadow-md relative z-10">
            <h2 className="text-sm md:text-base font-bold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">{card.title}</h2>
            {card.cost && (
              <div className={`rounded-full px-2 py-0.5 text-xs font-sans font-bold shadow-inner border border-black/30 ${card.manaColor}`}>
                {card.cost}
              </div>
            )}
          </div>

          {card.actualName && (
            <div className="mx-2 px-1 text-[9px] font-sans font-bold text-white/90 drop-shadow-md text-center">
              "{card.actualName}"
            </div>
          )}

          <div className={`mx-2 flex-1 rounded-[4px] border-2 border-black/80 bg-stone-900 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] relative overflow-hidden group-hover:shadow-[inset_0_0_30px_rgba(0,0,0,1)] transition-shadow ${card.actualName ? 'mt-1' : 'mt-2'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
            {card.image ? (
              <React.Fragment>
                <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-125 pointer-events-none" />
                <img src={card.image} alt={card.title} className="relative w-full h-full object-contain transform transition-transform group-hover:scale-110 duration-700 z-10" />
              </React.Fragment>
            ) : (
              IconComp && <IconComp size={80} className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] z-10 transform transition-transform group-hover:scale-110 duration-700" />
            )}
          </div>

          <div className="mx-2 mt-2 bg-gradient-to-b from-[#e3e8e3] to-[#c9d8c9] border-2 border-black/60 rounded-[4px] px-2 py-1 flex justify-between items-center shadow-md relative z-10">
            <span className="text-xs md:text-sm font-bold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">{card.type}</span>
            <div className={`w-4 h-4 rounded-full border border-black/50 flex items-center justify-center ${RARITY_COLOR[card.rarity] ?? 'bg-black'}`}>
              {card.actualName ? <StarShooting size={10} className="text-white" /> : <IconSparkles size={10} className="text-white" />}
            </div>
          </div>

          <div className="mx-2 mt-2 mb-2 h-[38%] bg-[#f0f0f0]/95 border-2 border-black/60 rounded-[4px] p-3 text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] relative z-10 flex flex-col justify-between">
            <div className="overflow-y-auto pr-1 text-[11px] md:text-[12px] leading-tight flex-1 font-serif">
              <p className="mb-2 whitespace-pre-line">{card.effect}</p>
              <p className="italic text-stone-700 mt-2 border-t border-black/20 pt-2 font-serif text-[10px] md:text-[11px] leading-tight">
                {card.flavor}
              </p>
            </div>
            {card.stats && (
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-b from-[#e3e8e3] to-[#c9d8c9] border-2 border-black/60 rounded-[4px] px-3 py-1 font-bold text-sm md:text-base text-black shadow-md">
                {card.stats}
              </div>
            )}
          </div>

          <div className="px-3 pb-1 text-[8px] font-sans text-white/80 font-bold flex justify-between relative z-10">
            <span>{card.actualName ? '2839 SLD' : '143/280'} • TCSS490</span>
            <span>™ & © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
