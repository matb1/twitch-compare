import { inject, injectable } from './../inversify.decorators';
import { ConcreteTimerFactoryToken } from './../timer/concrete-timer-factory';
import { Timer } from './../timer/timer';
import { TimerFactory } from './../timer/timer-factory';
import { GameStats, GameStatsProvider } from './game-stats-provider';
import { RealTimeGameStatsProvider } from './real-time-game-stats-provider';
import { TwitchGameStatsProviderToken } from './twitch-game-stats-provider';

export const TwitchRealTimeGameStatsProviderToken = Symbol('TwitchRealTimeGameStatsProvider');

@injectable()
export class TwitchRealTimeGameStatsProvider implements RealTimeGameStatsProvider {

  private timer: Timer;
  private callback: (stats: GameStats[]) => void;

  private previousStats: GameStats[];

  constructor(
    @inject(TwitchGameStatsProviderToken) private statsProvider: GameStatsProvider,
    @inject(ConcreteTimerFactoryToken) private timerFactory: TimerFactory
  ) {
  }

  public start(callback: (stats: GameStats[]) => void): void {
    if (this.timer) {
      return;
    }

    this.timer = this.timerFactory.periodic();
    this.callback = callback;

    // Poll stats every 4 seconds
    this.timer.start(4000, () => {
      this.fetchStatsAndNotify();
    });

    // Fetch stats right away
    this.fetchStatsAndNotify();
  }

  public stop(): void {
    if (!this.timer) {
      return;
    }

    this.timer.stop();
    this.timer = undefined;
    this.previousStats = undefined;
  }

  private async fetchStatsAndNotify(): Promise<void> {
    let stats = await this.statsProvider.get(['497078', '506274', '460630']);
    stats = stats.sort((a, b) => a.gameId.localeCompare(b.gameId));

    if (this.isStatsChanged(stats)) {
      this.callback(stats); // Only notify if stats has changed since last time
    }

    this.previousStats = stats;
  }

  private isStatsChanged(newStats: GameStats[]): boolean {
    if (!this.previousStats) {
      return true;
    }

    if (this.previousStats.length !== newStats.length) {
      return true;
    }

    for (let i = 0; i < newStats.length; i++) {
      if (this.previousStats[i].gameId !== newStats[i].gameId || this.previousStats[i].viewerCount !== newStats[i].viewerCount) {
        return true;
      }
    }

    return false;
  }
}