import { Timer } from './timer';
import { TimerFactory } from './timer-factory';

export class TimerFactoryMock implements TimerFactory {

  public periodicReturnValue: Timer;
  public pollingReturnValue: Timer;

  public periodic(): Timer {
    return this.periodicReturnValue;
  }

  public polling(): Timer {
    return this.pollingReturnValue;
  }

}