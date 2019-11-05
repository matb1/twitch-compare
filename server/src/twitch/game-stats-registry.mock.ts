import { GameStats } from './game-stats-provider';
import { GameStatsRegistry } from './game-stats-registry';

export class GameStatsRegistryMock implements GameStatsRegistry {

  public subscribeCallCount: number = 0;
  public subscribeRecordedParameter: { callback: (stats: GameStats[]) => void };
  public subscribeRecordedParameters: Array<{ callback: (stats: GameStats[]) => void }> = [];
  public subscribeReturnValue: number;
  public subscribeReturnValues: number[];

  public unsubscribeCallCount: number = 0;
  public unsubscribeRecordedParameter: { subscriptionId: number };
  public unsubscribeRecordedParameters: Array<{ subscriptionId: number }> = [];

  public subscribe(callback: (stats: GameStats[]) => void): number {
    this.subscribeCallCount++;
    this.subscribeRecordedParameter = { callback };
    this.subscribeRecordedParameters.push({ callback });

    return this.subscribeReturnValues ? this.subscribeReturnValues[this.subscribeCallCount - 1] : this.subscribeReturnValue;
  }

  public unsubscribe(subscriptionId: number): void {
    this.unsubscribeCallCount++;
    this.unsubscribeRecordedParameter = { subscriptionId };
    this.unsubscribeRecordedParameters.push({ subscriptionId });
  }
}