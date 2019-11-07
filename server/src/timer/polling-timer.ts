import { Timer } from './timer';

export class PollingTimer implements Timer {

  private timerId: NodeJS.Timeout;
  private timeout: number;
  private callback: () => void|Promise<void>;
  private working: boolean = false;
  private stopping: boolean = false;

  public start(timeout: number, callback: () => void|Promise<void>): Timer {
    if (this.timerId || this.stopping) {
      throw new Error('This PollingTimer is already in use!');
    }

    this.timeout = timeout;
    this.callback = callback;

    this.work();

    return this;
  }

  public stop(): Timer {
    if (!this.timerId) {
      return;
    }

    if (this.working) {
      this.stopping = true;
    }

    clearInterval(this.timerId);
    this.timerId = null;
    return this;
  }

  private work(): void {
    this.working = true;

    const promise: Promise<void> = this.callback() || Promise.resolve();

    promise.then(() => {
      this.working = false;

      if (this.stopping) {
        this.stopping = false;
      } else {
        this.timerId = setTimeout(() => {
          this.work();
        }, this.timeout);
      }
    });
  }
}