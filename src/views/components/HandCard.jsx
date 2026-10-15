import React, { useEffect, useRef, useState } from 'react';
import CardFace from './CardFace.jsx';

export default function HandCard({ card, index, total, isDragging, onPointerDown, onMouseEnter, onMouseLeave }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDrawn, setIsDrawn] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Staggered "draw" animation on mount.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDrawn(true);
    }, 400 + (index * 150));
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isDragging) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const multiplier = 10;
    setTilt({
      x: (y / (rect.height / 2)) * -multiplier,
      y: (x / (rect.width / 2)) * multiplier
    });
  };

  const handleMouseEnterInner = (e) => {
    setIsHovering(true);
    if (onMouseEnter) onMouseEnter(e, card.id, 'hand');
  };

  const handleMouseLeaveInner = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave();
  };

  // Fan the hand out around its center.
  const centerIndex = (total - 1) / 2;
  const diff = index - centerIndex;
  const rotation = diff * 4;
  const yOffset = Math.abs(diff) * Math.abs(diff) * 2;
  const xOffsetCSS = `calc(${diff} * clamp(50px, 8vw, 100px))`;

  let style = {};

  if (!isDrawn) {
    style = {
      transform: `translate(calc(45vw - 40px), -60vh) rotate(0deg) scale(0.3)`,
      zIndex: index,
      opacity: 0,
      pointerEvents: 'none'
    };
  } else if (isHovering && !isDragging) {
    style = {
      transform: `translate(${xOffsetCSS}, -50px) rotate(0deg) scale(1.15) perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      zIndex: 50,
      transition: 'transform 0.1s ease-out',
      opacity: 1
    };
  } else {
    style = {
      transform: `translate(${xOffsetCSS}, ${yOffset}px) rotate(${rotation}deg)`,
      zIndex: index,
      transition: 'transform 0.3s ease-out',
      opacity: isDragging ? 0.3 : 1
    };
  }

  return (
    <div
      ref={cardRef}
      onPointerDown={(e) => onPointerDown(e, card.id, 'hand')}
      onMouseEnter={handleMouseEnterInner}
      onMouseLeave={handleMouseLeaveInner}
      onMouseMove={handleMouseMove}
      style={style}
      className="absolute bottom-0 w-20 sm:w-28 md:w-36 aspect-[2.5/3.5] rounded-xl bg-black p-1 shadow-2xl cursor-grab active:cursor-grabbing origin-bottom preserve-3d touch-none"
    >
      <CardFace card={card} />
    </div>
  );
}
