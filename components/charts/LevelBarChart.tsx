'use client';

import { motion } from 'framer-motion';
import { LevelStats } from '@/lib/types';

interface LevelBarChartProps {
  data: LevelStats[];
  compact?: boolean;
}

export default function LevelBarChart({ data, compact = false }: LevelBarChartProps) {
  const maxTV = Math.max(...data.map(d => Math.abs(d.avgTV)), 50);

  if (compact) {
    return (
      <div className="space-y-2">
        {data.slice(0, 5).map((stat, index) => {
          const percentage = (Math.abs(stat.avgTV) / maxTV) * 100;
          const isPositive = stat.avgTV > 0;
          
          return (
            <motion.div
              key={stat.level}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs text-white/60 w-20 truncate">{stat.level}</span>
              <div className="flex-1 h-3 bg-surface rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className={`h-full rounded ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                />
              </div>
              <span className={`text-xs font-mono w-8 text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.avgTV > 0 ? '+' : ''}{stat.avgTV}
              </span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((stat, index) => {
        const percentage = (Math.abs(stat.avgTV) / maxTV) * 100;
        const isPositive = stat.avgTV > 0;
        const isPassing = stat.avgTV > 35;
        
        return (
          <motion.div
            key={stat.level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-surface rounded-lg border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">{stat.level}</span>
                <span className="text-xs text-white/40">({stat.playerCount} players)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono font-bold ${isPassing ? 'text-green-400' : isPositive ? 'text-yellow-400' : 'text-red-400'}`}>
                  {stat.avgTV > 0 ? '+' : ''}{stat.avgTV}
                </span>
                {isPassing && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                    MET
                  </span>
                )}
              </div>
            </div>
            
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className={`h-full rounded-full ${isPassing ? 'bg-green-500' : isPositive ? 'bg-yellow-500' : 'bg-red-500'}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
