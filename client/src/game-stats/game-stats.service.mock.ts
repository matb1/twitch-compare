import { BehaviorSubject, Observable } from 'rxjs';
import { GameStats } from './game-stats';

export class GameStatsServiceMock {

  public subject: BehaviorSubject<GameStats[]> = new BehaviorSubject<GameStats[]>(undefined);

  public get stats$(): Observable<GameStats[]> {
    return this.subject;
  }
}
