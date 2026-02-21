'use client';

import { motion } from 'framer-motion';
import { Player } from '@/lib/types';
import { ARCHETYPES } from '@/lib/archetypes';

interface LeaderboardProps {
  players: Player[];
  compact?: boolean;
  maxRows?: number;
}

export default function Leaderboard({ players, compact = false, maxRows = 10 }: LeaderboardProps) {
  if (players.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/30 text-sm py-8">
        No players yet - be the first to complete the challenge!
      </div>
    );
  }

  const displayPlayers = players.slice(0, maxRows);

  const getArchetypeIcon = (archetypeId: string) => {
    const archetype = ARCHETYPES.find((a) => a.id === archetypeId);
    return archetype?.icon || '🎯';
  };

  const getArchetypeColor = (archetypeId: string) => {
    const archetype = ARCHETYPES.find((a) => a.id === archetypeId);
    return archetype?.color || '#F26522';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '🥇' };
    if (rank === 2) return { bg: 'bg-gray-400/20', text: 'text-gray-300', icon: '🥈' };
    if (rank === 3) return { bg: 'bg-amber-600/20', text: 'text-amber-500', icon: '🥉' };
    return { bg: 'bg-white/5', text: 'text-white/50', icon: '' };
  };

  return (
    <div className="w-full">
      {/* Header */}
      {!compact && (
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-mono text-white/40 uppercase tracking-wider border-b border-border">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2">Level</div>
          <div className="col-span-2">Archetype</div>
          <div className="col-span-1 text-right">TV</div>
          <div className="col-span-1 text-right">OR</div>
          <div className="col-span-1 text-right">HR</div>
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-border/50">
        {displayPlayers.map((player, index) => {
          const rank = index + 1;
          const badge = getRankBadge(rank);
          const archetypeColor = getArchetypeColor(player.archetype);

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                grid gap-2 px-4 py-3 items-center
                ${compact ? 'grid-cols-6' : 'grid-cols-12'}
                ${rank <= 3 ? 'bg-gradient-to-r from-exl-orange/5 to-transparent' : ''}
                hover:bg-white/5 transition-colors
              `}
            >
              {/* Rank */}
              <div className={compact ? 'col-span-1' : 'col-span-1'}>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${badge.bg} ${badge.text} text-xs font-bold`}>
                  {badge.icon || rank}
                </span>
              </div>

              {/* Player Name */}
              <div className={compact ? 'col-span-2' : 'col-span-4'}>
                <p className="text-white font-medium truncate">{player.name}</p>
                {compact && (
                  <p className="text-white/40 text-xs truncate">{player.level}</p>
                )}
              </div>

              {/* Level (full view only) */}
              {!compact && (
                <div className="col-span-2">
                  <span className="text-white/60 text-sm">{player.level}</span>
                </div>
              )}

              {/* Archetype */}
              <div className={compact ? 'col-span-1' : 'col-span-2'}>
                <span
                  className="text-lg"
                  title={ARCHETYPES.find((a) => a.id === player.archetype)?.name}
                >
                  {getArchetypeIcon(player.archetype)}
                </span>
              </div>

              {/* TV Score */}
              <div className={`${compact ? 'col-span-1' : 'col-span-1'} text-right`}>
                <span
                  className="font-mono font-bold"
                  style={{ color: player.scores.TV > 35 ? '#F26522' : '#888' }}
                >
                  {player.scores.TV > 0 ? '+' : ''}{player.scores.TV}
                </span>
              </div>

              {/* OR Score (full view only) */}
              {!compact && (
                <div className="col-span-1 text-right">
                  <span className={`font-mono text-sm ${player.scores.OR < 40 ? 'text-blue-400' : 'text-white/40'}`}>
                    {player.scores.OR > 0 ? '+' : ''}{player.scores.OR}
                  </span>
                </div>
              )}

              {/* HR Score */}
              <div className={`${compact ? 'col-span-1' : 'col-span-1'} text-right`}>
                <span className={`font-mono text-sm ${player.scores.HR > 0 ? 'text-purple-400' : 'text-white/40'}`}>
                  {player.scores.HR > 0 ? '+' : ''}{player.scores.HR}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {players.length > maxRows && (
        <div className="text-center py-3 text-white/30 text-sm">
          +{players.length - maxRows} more players
        </div>
      )}
    </div>
  );
}
