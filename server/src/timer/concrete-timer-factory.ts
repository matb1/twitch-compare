import { injectable } from './../inversify.decorators';
import { PeriodicTimer } from './periodic-timer';
import { PollingTimer } from './polling-timer';
import { Timer } from './timer';
import { TimerFactory } from './timer-factory';

export const ConcreteTimerFactoryToken = Symbol('ConcreteTimerFactory');

@injectable()
export class ConcreteTimerFactory implements TimerFactory {

  public periodic(): Timer {
    return new PeriodicTimer();
  }

  public polling(): Timer {
    return new PollingTimer();
  }

}