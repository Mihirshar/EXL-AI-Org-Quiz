'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOTAL_LEVELS } from '@/lib/gameData';

interface InfographicImagesProps {
  currentLevelIndex: number;
  selectedChoice: 'A' | 'B' | null;
  displayOrder: ('A' | 'B')[];
}

function getImagePath(levelIndex: number, option: 'A' | 'B'): string {
  return `/infographics/level-${levelIndex + 1}-${option.toLowerCase()}.png`;
}

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-white/5 border border-dashed border-white/15 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <div className="text-2xl mb-2 opacity-40">🖼️</div>
          <p className="text-white/30 text-[10px] font-mono">{src.split('/').pop()}</p>
          <p className="text-white/20 text-[9px] mt-1">Place image in /public/infographics/</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-lg border border-white/10 ${className}`}
      onError={() => setError(true)}
    />
  );
}

export default function InfographicImages({ currentLevelIndex, selectedChoice, displayOrder }: InfographicImagesProps) {
  const firstOption = displayOrder[0];
  const secondOption = displayOrder[1];
  
  const optionStyles = {
    A: {
      selected: 'ring-2 ring-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
      badge: 'bg-blue-500/80 border-blue-400/40',
    },
    B: {
      selected: 'ring-2 ring-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      badge: 'bg-purple-500/80 border-purple-400/40',
    },
  };

  return (
    <div className="p-3 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🖼️</span>
          <span className="font-medium text-white text-sm">Visual Insights</span>
        </div>
        <span className="text-white/30 text-[10px] font-mono">
          Decision {currentLevelIndex + 1}/{TOTAL_LEVELS}
        </span>
      </div>

      {/* Images */}
      <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`images-${currentLevelIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* First Option Image (displayed as Option A) */}
            <div className={`
              relative rounded-xl overflow-hidden transition-all duration-300
              ${selectedChoice === firstOption ? optionStyles[firstOption].selected : ''}
              ${selectedChoice !== null && selectedChoice !== firstOption ? 'opacity-50' : ''}
            `}>
              <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-white border backdrop-blur-sm ${optionStyles[firstOption].badge}`}>
                Option A
              </div>
              <ImageWithFallback
                src={getImagePath(currentLevelIndex, firstOption)}
                alt={`Decision ${currentLevelIndex + 1} - Option A infographic`}
                className="w-full h-auto"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 px-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/20 text-[9px] font-mono uppercase tracking-widest">vs</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Second Option Image (displayed as Option B) */}
            <div className={`
              relative rounded-xl overflow-hidden transition-all duration-300
              ${selectedChoice === secondOption ? optionStyles[secondOption].selected : ''}
              ${selectedChoice !== null && selectedChoice !== secondOption ? 'opacity-50' : ''}
            `}>
              <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-white border backdrop-blur-sm ${optionStyles[secondOption].badge}`}>
                Option B
              </div>
              <ImageWithFallback
                src={getImagePath(currentLevelIndex, secondOption)}
                alt={`Decision ${currentLevelIndex + 1} - Option B infographic`}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-white/5 mt-2">
        <p className="text-white/15 text-[8px] text-center font-mono">
          Visual data to support your decision
        </p>
      </div>
    </div>
  );
}
