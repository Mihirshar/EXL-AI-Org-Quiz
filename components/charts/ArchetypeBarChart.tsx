'use client';

import { motion } from 'framer-motion';
import { ArchetypeStats } from '@/lib/types';
import { ARCHETYPES } from '@/lib/archetypes';

interface ArchetypeBarChartProps {
  data: ArchetypeStats[];
  highlightedArchetype?: string;
  compact?: boolean;
}

export default function ArchetypeBarChart({ data, highlightedArchetype, compact = false }: ArchetypeBarChartProps) {
  const allArchetypes = ARCHETYPES.map(a => {
    const stat = data.find(d => d.name === a.name.replace('The ', ''));
    return {
      id: a.id,
      name: a.name.replace('The ', ''),
      icon: a.icon,
      count: stat?.count || 0,
      color: a.color,
    };
  });

  const maxCount = Math.max(...allArchetypes.map(a => a.count), 1);
  const totalCount = allArchetypes.reduce((sum, a) => sum + a.count, 0);

  if (compact) {
    return (
      <div className="space-y-2">
        {allArchetypes.map((a, index) => {
          const percentage = totalCount > 0 ? (a.count / totalCount) * 100 : 0;
          const isHighlighted = highlightedArchetype === a.id;
          
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-2 ${isHighlighted ? 'opacity-100' : 'opacity-70'}`}
            >
              <span className="text-sm flex-shrink-0">{a.icon}</span>
              <div className="flex-1 h-4 bg-surface rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="h-full rounded"
                  style={{ 
                    backgroundColor: a.color,
                    boxShadow: isHighlighted ? `0 0 8px ${a.color}50` : 'none',
                  }}
                />
              </div>
              <span className="text-xs font-mono text-white/60 w-6 text-right">{a.count}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allArchetypes.map((a, index) => {
        const percentage = maxCount > 0 ? (a.count / maxCount) * 100 : 0;
        const isHighlighted = highlightedArchetype === a.id;
        
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`
              p-4 rounded-xl border transition-all duration-300
              ${isHighlighted 
                ? 'bg-surface border-exl-orange/50 shadow-[0_0_20px_rgba(242,101,34,0.2)]' 
                : 'bg-surface/50 border-border'
              }
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${isHighlighted ? '' : 'grayscale'}`}>{a.icon}</span>
                <div>
                  <h4 className={`font-medium ${isHighlighted ? 'text-white' : 'text-white/70'}`}>
                    {a.name}
                  </h4>
                  {isHighlighted && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs text-exl-orange font-mono"
                    >
                      YOUR ARCHETYPE
                    </motion.span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold font-mono ${isHighlighted ? 'text-white' : 'text-white/50'}`}>
                  {a.count}
                </span>
                <p className="text-xs text-white/40">
                  {totalCount > 0 ? Math.round((a.count / totalCount) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Bar */}
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: a.color,
                  boxShadow: isHighlighted ? `0 0 12px ${a.color}60` : 'none',
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
