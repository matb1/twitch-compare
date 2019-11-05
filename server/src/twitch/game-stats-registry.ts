import { GameStats } from './game-stats-provider';

export interface GameStatsRegistry {
  subscribe(callback: (stats: GameStats[]) => void): number;
  unsubscribe(subscriptionId: number): void;
}