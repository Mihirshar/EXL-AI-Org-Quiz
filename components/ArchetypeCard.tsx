'use client';

import { motion } from 'framer-motion';
import { Archetype } from '@/lib/archetypes';

interface ArchetypeCardProps {
  archetype: Archetype;
  delay?: number;
}

export default function ArchetypeCard({ archetype, delay = 0 }: ArchetypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border-2"
      style={{ borderColor: `${archetype.color}40` }}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${archetype.color}, transparent 60%)`,
        }}
      />

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
            className="text-5xl"
          >
            {archetype.icon}
          </motion.div>
          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
              className="font-mono text-xs uppercase tracking-wider mb-1"
              style={{ color: archetype.color }}
            >
              {archetype.subtitle}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.5 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              {archetype.name}
            </motion.h3>
          </div>
        </div>

        {/* Diagnosis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.6 }}
          className="mb-6"
        >
          <p className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">
            Diagnosis
          </p>
          <p className="text-white/80 leading-relaxed">{archetype.diagnosis}</p>
        </motion.div>

        {/* Impact & Reality */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.7 }}
            className="bg-surface-light/50 rounded-xl p-4"
          >
            <p className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">
              First Order Impact
            </p>
            <p className="text-sm text-white/70 leading-relaxed">{archetype.impact}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.8 }}
            className="bg-surface-light/50 rounded-xl p-4"
          >
            <p className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">
              Second Order Reality
            </p>
            <p className="text-sm text-white/70 leading-relaxed">{archetype.reality}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
