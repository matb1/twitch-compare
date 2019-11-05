import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-stats-card',
  templateUrl: './game-stats-card.component.html'
})
export class GameStatsCardComponent {
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public link: string;
  @Input() public viewerCount: number;
}
