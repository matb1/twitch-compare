import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameStats } from './game-stats';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStatsService {

  private subject: BehaviorSubject<GameStats[]>;

  constructor(socket: Socket) {
    this.subject = new BehaviorSubject<GameStats[]>([]);

    socket.on('/twitch/stats', (stats: GameStats[]) => {
      this.subject.next(stats);
    });
  }

  public get stats$(): Observable<GameStats[]> {
    return this.subject;
  }
}
