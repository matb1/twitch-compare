import { GameStats } from './game-stats-provider';
import { RealTimeGameStatsProvider } from './real-time-game-stats-provider';

export class RealTimeGameStatsProviderMock implements RealTimeGameStatsProvider {

  public startCallCount: number = 0;
  public startRecordedParameter: { callback: (stats: GameStats[]) => void };
  public startRecordedParameters: Array<{ callback: (stats: GameStats[]) => void }> = [];

  public stopCallCount: number = 0;

  public start(callback: (stats: GameStats[]) => void): void {
    this.startCallCount++;
    this.startRecordedParameter = { callback };
    this.startRecordedParameters.push({ callback });
  }

  public stop(): void {
    this.stopCallCount++;
  }
}