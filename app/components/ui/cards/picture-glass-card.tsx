'use client';

import React, { useRef, useState } from 'react';
import { GlassCard } from './glass-card'; // Adjust import path as needed

interface PictureGlassCardProps {
  image: string; // URL or asset path to the full picture
  caption?: string;
  summary?: string;
  link?:string;
  className?: string;
}

export function PictureGlassCard({ image, caption, link, summary, className }: PictureGlassCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -8, rotateY: x * 8 });
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0 });
  }

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center ${link ? 'cursor-pointer' : ''} ${className || ''}`}
        onClick={link ? () => window.open(link, '_blank', 'noopener,noreferrer') : undefined}
      >
        <GlassCard className="w-full max-w-full group transition-colors duration-300 hover:bg-black/[0.075]">
          <div className="py-6 px-2 sm:py-10 sm:px-6 md:py-16 md:px-12 lg:py-20 lg:px-20 items-center justify-center" style={{ perspective: '1000px' }}>
            <div
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="mx-auto w-full aspect-video rounded-xl border border-white/10 overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-white/25 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: 'transform 150ms ease-out',
              }}
            >
              <img
                src={image}
                alt="Full picture"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </GlassCard>
      </div>
      <div className="mt-3 flex items-center justify-between">
        {caption && <p className="text-start text-black/90">{caption} &bull; <span className="text-gray-500">{summary}</span></p>}
      </div>
    </div>
  );
}
