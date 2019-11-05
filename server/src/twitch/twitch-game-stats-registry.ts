import { inject, injectable } from './../inversify.decorators';
import { GameStats } from './game-stats-provider';
import { GameStatsRegistry } from './game-stats-registry';
import { RealTimeGameStatsProvider } from './real-time-game-stats-provider';
import { TwitchRealTimeGameStatsProviderToken } from './twitch-real-time-game-stats-provider';

export const TwitchGameStatsRegistryToken = Symbol('TwitchGameStatsRegistry');

@injectable()
export class TwitchGameStatsRegistry implements GameStatsRegistry {

  private subscriptions: Map<number, (stats: GameStats[]) => void> = new Map<number, (stats: GameStats[]) => void>();
  private subscriptionId: number = 0;
  private subscriptionCount: number = 0;

  constructor(@inject(TwitchRealTimeGameStatsProviderToken) private realTimeStatsProvider: RealTimeGameStatsProvider) {
  }

  public subscribe(callback: (stats: GameStats[]) => void): number {
    this.subscriptionId++;
    this.subscriptionCount++;
    this.subscriptions.set(this.subscriptionId, callback);

    if (this.subscriptionCount === 1) {
      this.startMonitoring();
    }

    return this.subscriptionId;
  }

  public unsubscribe(subscriptionId: number): void {
    if (!this.subscriptions.has(subscriptionId)) {
      return;
    }

    this.subscriptions.delete(subscriptionId);
    this.subscriptionCount--;

    if (this.subscriptionCount === 0) {
      this.realTimeStatsProvider.stop();
    }
  }

  private startMonitoring(): void {
    this.realTimeStatsProvider.start((stats: GameStats[]) => {
      const callbacks = this.subscriptions.values();
      for (const callback of callbacks) {
        callback(stats);
      }
    });
  }
}