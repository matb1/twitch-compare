import { GameStats, GameStatsProvider } from './game-stats-provider';

export class GameStatsProviderMock implements GameStatsProvider {

  public getCallCount: number = 0;
  public getRecordedParameter: { gameIds: string[] };
  public getRecordedParameters: Array<{ gameIds: string[] }> = [];
  public getError: any;
  public getReturnValue: GameStats[];
  public getReturnValues: GameStats[][];

  public get(gameIds: string[]): Promise<GameStats[]> {
    this.getCallCount++;
    this.getRecordedParameter = { gameIds };
    this.getRecordedParameters.push({ gameIds });

    return new Promise<GameStats[]>((resolve, reject) => {
      if (this.getError) {
        reject(this.getError);
      } else {
        resolve(this.getReturnValues ? this.getReturnValues[this.getCallCount - 1] : this.getReturnValue);
      }
    });
  }
}