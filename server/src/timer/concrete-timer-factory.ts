import { injectable } from './../inversify.decorators';
import { PeriodicTimer } from './periodic-timer';
import { Timer } from './timer';
import { TimerFactory } from './timer-factory';

export const ConcreteTimerFactoryToken = Symbol('ConcreteTimerFactory');

@injectable()
export class ConcreteTimerFactory implements TimerFactory {

  public periodic(): Timer {
    return new PeriodicTimer();
  }

}