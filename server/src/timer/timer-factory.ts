import { Timer } from './timer';

export interface TimerFactory {
  periodic(): Timer;
  polling(): Timer;
}