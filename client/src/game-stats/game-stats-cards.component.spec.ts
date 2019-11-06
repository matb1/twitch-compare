import { GameStatsCardsComponent } from './game-stats-cards.component';
import { GameStatsServiceMock } from './game-stats.service.mock';
import { rit } from './../jest-extensions';
import { GameStats } from './game-stats';

describe('GameStatsCardsComponent', () => {
  let component: GameStatsCardsComponent;
  let mockStatsService: GameStatsServiceMock;

  beforeEach(() => {
    mockStatsService = new GameStatsServiceMock();
    component = new GameStatsCardsComponent(mockStatsService as any);
    component.ngOnInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  describe('gameMetadataList', () => {

    it('contains no entries at first.', () => {
      expect(component.gameMetadataList.length).toEqual(0);
    });


    it('contains three entries after the first notification.', () => {
      mockStatsService.subject.next([]);
      expect(component.gameMetadataList.length).toEqual(3);
    });

    it('contains a first entry for Rainbow Six.', () => {
      mockStatsService.subject.next([]);
      expect(component.gameMetadataList[0].title).toEqual(`Tom Clancy's Rainbow Six: Siege`);
      expect(component.gameMetadataList[0].subtitle).toEqual('Ubisoft');
      expect(component.gameMetadataList[0].link).toEqual(`https://www.twitch.tv/directory/game/Tom%20Clancy's%20Rainbow%20Six%3A%20Siege`);
      expect(component.gameMetadataList[0].viewerCount).toEqual(0);
    });

    rit(
      'Rainbow Six\'s viewer count is updated whenever game stats for game id 460630 are received.',

      [[{ gameId: '460630', viewerCount: 756 } ],                                                                                756],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '460630', viewerCount: 456 }, { gameId: '506274', viewerCount: 789 }], 456],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '506274', viewerCount: 789 }],                                         0],

      (stats: GameStats[], expectedViewerCount: number) => {
        mockStatsService.subject.next(stats);
        expect(component.gameMetadataList[0].viewerCount).toEqual(expectedViewerCount);
      }
    );

    it('contains a second entry for Far Cry 5.', () => {
      mockStatsService.subject.next([]);
      expect(component.gameMetadataList[1].title).toEqual('Far Cry 5');
      expect(component.gameMetadataList[1].subtitle).toEqual('Ubisoft');
      expect(component.gameMetadataList[1].link).toEqual(`https://www.twitch.tv/directory/game/Far%20Cry%205`);
      expect(component.gameMetadataList[1].viewerCount).toEqual(0);
    });

    rit(
      'Far Cry 5\'s viewer count is updated whenever game stats for game id 497078 are received.',

      [[{ gameId: '497078', viewerCount: 756 } ],                                                                                756],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '460630', viewerCount: 456 }, { gameId: '506274', viewerCount: 789 }], 123],
      [[{ gameId: '460630', viewerCount: 123 }, { gameId: '506274', viewerCount: 789 }],                                         0],

      (stats: GameStats[], expectedViewerCount: number) => {
        mockStatsService.subject.next(stats);
        expect(component.gameMetadataList[1].viewerCount).toEqual(expectedViewerCount);
      }
    );

    it('contains a third entry for Assassin\'s Creed Odyssey.', () => {
      mockStatsService.subject.next([]);
      expect(component.gameMetadataList[2].title).toEqual(`Assassin's Creed Odyssey`);
      expect(component.gameMetadataList[2].subtitle).toEqual('Ubisoft');
      expect(component.gameMetadataList[2].link).toEqual(`https://www.twitch.tv/directory/game/Assassin's%20Creed%20Odyssey`);
      expect(component.gameMetadataList[2].viewerCount).toEqual(0);
    });

    rit(
      'Assassin\'s Creed Odyssey\'s viewer count is updated whenever game stats for game id 506274 are received.',

      [[{ gameId: '506274', viewerCount: 756 } ],                                                                                756],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '506274', viewerCount: 456 }, { gameId: '460630', viewerCount: 789 }], 456],
      [[{ gameId: '460630', viewerCount: 123 }, { gameId: '497078', viewerCount: 789 }],                                         0],

      (stats: GameStats[], expectedViewerCount: number) => {
        mockStatsService.subject.next(stats);
        expect(component.gameMetadataList[2].viewerCount).toEqual(expectedViewerCount);
      }
    );
  });
});
