import { Component } from '@angular/core';

@Component({
  selector: 'app-game-stats-cards',
  templateUrl: './game-stats-cards.component.html',
  styleUrls: ['./game-stats-cards.component.scss']
})
export class GameStatsCardsComponent {
  public r6Title: string = `Tom Clancy's Rainbow Six: Siege`;
  public r6Subtitle: string = 'Ubisoft';
  public r6ViewerCount: number = 1435;
  public r6Link: string = `https://www.twitch.tv/directory/game/Tom%20Clancy's%20Rainbow%20Six%3A%20Siege`;

  public f5Title: string = 'Far Cry 5';
  public f5Subtitle: string = 'Ubisoft';
  public f5ViewerCount: number = 15;
  public f5Link: string = `https://www.twitch.tv/directory/game/Far%20Cry%205`;

  public acTitle: string = `Assassin's Creed Odyssey`;
  public acSubtitle: string = 'Ubisoft';
  public acViewerCount: number = 143;
  public acLink: string = `https://www.twitch.tv/directory/game/Assassin's%20Creed%20Odyssey`;
}
