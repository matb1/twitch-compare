import { Timer } from './timer';

export class PeriodicTimer implements Timer {

  private timerId: NodeJS.Timeout;

  public start(timeout: number, callback: () => void): Timer {
    if (this.timerId) {
      throw new Error('This PeriodicTimer is already in use!');
    }

    this.timerId = setInterval(() => {
      return callback();
    }, timeout);

    return this;
  }

  public stop(): Timer {
    clearInterval(this.timerId);
    this.timerId = null;
    return this;
  }
}