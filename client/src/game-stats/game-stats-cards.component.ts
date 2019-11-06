import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameStatsService } from './game-stats.service';
import { Subscription } from 'rxjs';
import { GameStats, GameId, GameDatabase } from './game-stats';

interface GameMetadata {
  title: string;
  subtitle: string;
  link: string;
  viewerCount: number;
}

@Component({
  selector: 'app-game-stats-cards',
  templateUrl: './game-stats-cards.component.html',
  styleUrls: ['./game-stats-cards.component.scss']
})
export class GameStatsCardsComponent implements OnInit, OnDestroy {

  public gameMetadataList: GameMetadata[] = [];
  private subscription: Subscription;

  constructor(private gameStatsService: GameStatsService) {
  }

  public ngOnInit(): void {
    this.subscription = this.gameStatsService.stats$.subscribe((stats: GameStats[]) => this.process(stats));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private process(statsList: GameStats[]): void {
    if (!statsList) {
      return;
    }

    this.gameMetadataList = [];

    const gameIds = [GameId.RainbowSixSiege, GameId.FarCry5, GameId.AssassinsCreedOdyssey];

    for (const gameId of gameIds) {
      const stats = statsList.find((s) => s.gameId === gameId);
      this.gameMetadataList.push({
        title: GameDatabase[gameId].title,
        subtitle: GameDatabase[gameId].dev,
        link: GameDatabase[gameId].link,
        viewerCount: (stats && stats.viewerCount) || 0
      });
    }
  }
}
