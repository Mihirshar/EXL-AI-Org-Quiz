'use client';

import { motion } from 'framer-motion';
import EXLLogo from './EXLLogo';
import ArchetypeBarChart from './charts/ArchetypeBarChart';
import LevelBarChart from './charts/LevelBarChart';
import Leaderboard from './charts/Leaderboard';
import { usePlayerContext } from '@/lib/playerContext';

interface AnalyticsDashboardProps {
  onBack: () => void;
  onPlayAgain: () => void;
}

export default function AnalyticsDashboard({ onBack, onPlayAgain }: AnalyticsDashboardProps) {
  const { players, getLevelStats, getArchetypeStats, getLeaderboard } = usePlayerContext();

  const levelStats = getLevelStats();
  const archetypeStats = getArchetypeStats();
  const leaderboard = getLeaderboard();

  const totalPlayers = players.length;
  const avgTV = totalPlayers > 0
    ? Math.round(players.reduce((sum, p) => sum + p.scores.TV, 0) / totalPlayers)
    : 0;
  const successRate = totalPlayers > 0
    ? Math.round((players.filter((p) => p.scores.TV > 35 && p.scores.OR < 40 && p.scores.HR > 0).length / totalPlayers) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full px-6 py-8 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <EXLLogo size="sm" withGlow={false} />
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-white/50 text-sm">Live session performance metrics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onBack} className="btn-secondary text-sm">
              ← Back to Results
            </button>
            <button onClick={onPlayAgain} className="btn-primary text-sm">
              Play Again
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">
              Total Players
            </p>
            <p className="text-4xl font-bold text-exl-orange">{totalPlayers}</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">
              Avg Turnaround Value
            </p>
            <p className="text-4xl font-bold text-white">
              {avgTV > 0 ? '+' : ''}{avgTV}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5 text-center">
            <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">
              Success Rate
            </p>
            <p className="text-4xl font-bold text-exl-orange">{successRate}%</p>
          </div>
        </motion.div>

        {/* Charts Row - Bar Charts Only */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Archetype Distribution */}
          <motion.div
            variants={itemVariants}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            <h2 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
              Leadership Archetype Distribution
            </h2>
            <ArchetypeBarChart data={archetypeStats} />
          </motion.div>

          {/* Level Performance */}
          <motion.div
            variants={itemVariants}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            <h2 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
              Average TV Score by Level
            </h2>
            <LevelBarChart data={levelStats} />
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div
          variants={itemVariants}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h2 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
            Session Leaderboard — Top Performers
          </h2>
          <Leaderboard players={leaderboard} maxRows={15} />
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-8 pb-8 text-white/30 text-sm"
        >
          Data is session-based and will reset when the page is closed
        </motion.div>
      </div>
    </motion.div>
  );
}
