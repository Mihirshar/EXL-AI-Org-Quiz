'use client';

import { motion } from 'framer-motion';
import { TOTAL_LEVELS } from '@/lib/gameData';

interface ProgressBarProps {
  currentLevel: number;
  completedLevels: number;
}

export default function ProgressBar({ currentLevel, completedLevels }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: TOTAL_LEVELS }).map((_, index) => {
        const isCompleted = index < completedLevels;
        const isCurrent = index === currentLevel;
        
        return (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
              h-2 flex-1 rounded-full transition-all duration-500
              ${isCompleted 
                ? 'bg-gradient-to-r from-exl-orange to-exl-orange-light' 
                : isCurrent 
                  ? 'bg-white' 
                  : 'bg-border'
              }
            `}
          />
        );
      })}
    </div>
  );
}
