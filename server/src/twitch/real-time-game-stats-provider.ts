import { GameStats } from './game-stats-provider';

export interface RealTimeGameStatsProvider {
  start(callback: (stats: GameStats[]) => void): void;
  stop(): void;
}