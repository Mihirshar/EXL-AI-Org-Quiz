'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Archetype } from '@/lib/archetypes';

interface ArchetypeInfographicProps {
  archetype: Archetype;
  delay?: number;
}

export default function ArchetypeInfographic({ archetype, delay = 0 }: ArchetypeInfographicProps) {
  const hasImage = archetype.infographicImage;

  if (!hasImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="relative rounded-xl border border-border bg-surface overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative p-6 text-center">
          <span className="text-6xl mb-4 block">{archetype.icon}</span>
          <h3 className="text-xl font-bold text-white mb-2">{archetype.name}</h3>
          <p className="text-white/50 text-sm">{archetype.subtitle}</p>
          <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-white/60 text-sm leading-relaxed">{archetype.diagnosis}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="relative rounded-xl border-2 border-border overflow-hidden shadow-2xl"
      style={{ 
        boxShadow: `0 0 40px ${archetype.color}30, 0 20px 60px rgba(0,0,0,0.5)`,
        borderColor: `${archetype.color}40`,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
        className="relative aspect-[4/3] w-full"
      >
        <Image
          src={archetype.infographicImage!}
          alt={`${archetype.name} Infographic`}
          fill
          className="object-cover"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.5, duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <div className="flex items-center gap-3">
            <span 
              className="text-3xl p-2 rounded-lg"
              style={{ backgroundColor: `${archetype.color}30` }}
            >
              {archetype.icon}
            </span>
            <div>
              <h3 className="text-white font-bold text-lg">{archetype.name}</h3>
              <p className="text-white/70 text-sm">{archetype.subtitle}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: archetype.color, transformOrigin: 'left' }}
      />
    </motion.div>
  );
}
