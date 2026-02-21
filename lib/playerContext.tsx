'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Player, CurrentPlayer, Level, LevelStats, ArchetypeStats, LEVELS } from './types';
import { ARCHETYPES } from './archetypes';

interface PlayerContextType {
  players: Player[];
  currentPlayer: CurrentPlayer | null;
  addPlayer: (player: Player) => void;
  setCurrentPlayer: (name: string, level: Level, photoUrl?: string, selfArchetypeId?: string) => void;
  updateCurrentPlayerAvatar: (avatarUrl: string) => void;
  clearCurrentPlayer: () => void;
  getLevelStats: () => LevelStats[];
  getArchetypeStats: () => ArchetypeStats[];
  getLeaderboard: () => Player[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayerState] = useState<CurrentPlayer | null>(null);

  const addPlayer = useCallback((player: Player) => {
    setPlayers((prev) => [...prev, player]);
  }, []);

  const setCurrentPlayer = useCallback((name: string, level: Level, photoUrl?: string, selfArchetypeId?: string) => {
    setCurrentPlayerState({ name, level, photoUrl, selfArchetypeId });
  }, []);

  const updateCurrentPlayerAvatar = useCallback((avatarUrl: string) => {
    setCurrentPlayerState((prev) => prev ? { ...prev, avatarUrl } : null);
  }, []);

  const clearCurrentPlayer = useCallback(() => {
    setCurrentPlayerState(null);
  }, []);

  const getLevelStats = useCallback((): LevelStats[] => {
    const levelMap = new Map<Level, { tvSum: number; orSum: number; ivSum: number; hrSum: number; count: number }>();

    LEVELS.forEach((level) => {
      levelMap.set(level, { tvSum: 0, orSum: 0, ivSum: 0, hrSum: 0, count: 0 });
    });

    players.forEach((player) => {
      const stats = levelMap.get(player.level);
      if (stats) {
        stats.tvSum += player.scores.TV;
        stats.orSum += player.scores.OR;
        stats.ivSum += player.scores.IV;
        stats.hrSum += player.scores.HR;
        stats.count += 1;
      }
    });

    return LEVELS.map((level) => {
      const stats = levelMap.get(level)!;
      return {
        level,
        avgTV: stats.count > 0 ? Math.round(stats.tvSum / stats.count) : 0,
        avgOR: stats.count > 0 ? Math.round(stats.orSum / stats.count) : 0,
        avgIV: stats.count > 0 ? Math.round(stats.ivSum / stats.count) : 0,
        avgHR: stats.count > 0 ? Math.round(stats.hrSum / stats.count) : 0,
        playerCount: stats.count,
      };
    }).filter((stat) => stat.playerCount > 0);
  }, [players]);

  const getArchetypeStats = useCallback((): ArchetypeStats[] => {
    const archetypeMap = new Map<string, number>();

    players.forEach((player) => {
      const count = archetypeMap.get(player.archetype) || 0;
      archetypeMap.set(player.archetype, count + 1);
    });

    return ARCHETYPES.map((archetype) => ({
      name: archetype.name.replace('The ', ''),
      count: archetypeMap.get(archetype.id) || 0,
      color: archetype.color,
    })).filter((stat) => stat.count > 0);
  }, [players]);

  const getLeaderboard = useCallback((): Player[] => {
    return [...players].sort((a, b) => b.scores.TV - a.scores.TV);
  }, [players]);

  return (
    <PlayerContext.Provider
      value={{
        players,
        currentPlayer,
        addPlayer,
        setCurrentPlayer,
        updateCurrentPlayerAvatar,
        clearCurrentPlayer,
        getLevelStats,
        getArchetypeStats,
        getLeaderboard,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
}
