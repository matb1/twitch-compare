import { Timer } from './timer';

export class TimerMock implements Timer {

  public startCallCount: number = 0;
  public startRecordedParameter: { timeout: number, callback: () => void };
  public startRecordedParameters: Array<{ timeout: number, callback: () => void }> = [];

  public stopCallCount: number = 0;

  public start(timeout: number, callback: () => void): Timer {
    this.startCallCount++;
    this.startRecordedParameter = { timeout, callback };
    this.startRecordedParameters.push({ timeout, callback });
    return this;
  }

  public stop(): Timer {
    this.stopCallCount++;
    return this;
  }

}