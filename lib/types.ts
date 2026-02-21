import { Scores } from './gameData';

export const LEVELS = [
  'Board Member',
  'Leadership',
  'Senior Management',
  'Managers',
  'HR',
  'Technology',
  'Operations',
  'Finance',
  'Other',
] as const;

export type Level = typeof LEVELS[number];

export interface Player {
  id: string;
  name: string;
  level: Level;
  scores: Scores;
  archetype: string;
  selfArchetypeId?: string;
  choices: ('A' | 'B')[];
  completedAt: Date;
  photoUrl?: string;
  avatarUrl?: string;
}

export interface CurrentPlayer {
  name: string;
  level: Level;
  photoUrl?: string;
  avatarUrl?: string;
  selfArchetypeId?: string;
}

export interface LevelStats {
  level: Level;
  avgTV: number;
  avgOR: number;
  avgIV: number;
  avgHR: number;
  playerCount: number;
}

export interface ArchetypeStats {
  name: string;
  count: number;
  color: string;
}
