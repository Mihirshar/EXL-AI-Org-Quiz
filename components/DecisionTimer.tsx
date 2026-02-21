'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DecisionTimerProps {
  duration?: number;
  isActive: boolean;
  onTimeUp?: () => void;
  showUrgency?: boolean;
}

export default function DecisionTimer({
  duration = 60,
  isActive,
  onTimeUp,
  showUrgency = true,
}: DecisionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPulsing, setIsPulsing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 15 && showUrgency) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [timeLeft, showUrgency]);

  const progress = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 15;
  const isCritical = timeLeft <= 5;

  const getColor = () => {
    if (isCritical) return { ring: '#EF4444', text: 'text-red-400', glow: 'rgba(239, 68, 68, 0.4)' };
    if (isUrgent) return { ring: '#F59E0B', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.3)' };
    return { ring: '#F26522', text: 'text-exl-orange', glow: 'rgba(242, 101, 34, 0.2)' };
  };

  const color = getColor();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2"
    >
      {/* Circular Progress */}
      <div className="relative w-10 h-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={color.ring}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${progress} 100`}
            animate={isPulsing ? { 
              filter: [`drop-shadow(0 0 4px ${color.glow})`, `drop-shadow(0 0 8px ${color.glow})`, `drop-shadow(0 0 4px ${color.glow})`]
            } : {}}
            transition={isPulsing ? { duration: 0.5, repeat: Infinity } : {}}
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={timeLeft}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={`text-[10px] font-mono font-bold ${color.text}`}
            >
              {timeLeft}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col">
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">
          Decision
        </span>
        <motion.span 
          className={`text-xs font-mono ${color.text}`}
          animate={isPulsing ? { opacity: [1, 0.6, 1] } : {}}
          transition={isPulsing ? { duration: 0.5, repeat: Infinity } : {}}
        >
          {formatTime(timeLeft)}
        </motion.span>
      </div>

      {/* Urgency Badge */}
      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={`
              px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider
              ${isCritical 
                ? 'bg-red-500/20 text-red-400 animate-pulse' 
                : 'bg-amber-500/20 text-amber-400'
              }
            `}
          >
            {isCritical ? 'Decide Now!' : 'Hurry!'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
