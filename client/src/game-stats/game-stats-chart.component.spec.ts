import { GameStatsServiceMock } from './game-stats.service.mock';
import { rit } from './../jest-extensions';
import { GameStats } from './game-stats';
import { GameStatsChartComponent, ChartData } from './game-stats-chart.component';

describe('GameStatsChartComponent', () => {
  let component: GameStatsChartComponent;
  let mockStatsService: GameStatsServiceMock;

  beforeEach(() => {
    mockStatsService = new GameStatsServiceMock();
    component = new GameStatsChartComponent(mockStatsService as any);
    component.ngOnInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  describe('results', () => {

    it('contains no entries at first.', () => {
      expect(component.results.length).toEqual(0);
    });


    it('contains three entries after the first notification.', () => {
      mockStatsService.subject.next([]);
      expect(component.results.length).toEqual(3);
    });

    it('contains a first entry for Rainbow Six.', () => {
      mockStatsService.subject.next([]);
      expect(component.results[0].name).toEqual(`Tom Clancy's Rainbow Six: Siege`);
    });

    rit(
      'Rainbow Six\'s viewer count is updated whenever game stats for game id 460630 are received.',

      [[{ gameId: '460630', viewerCount: 756 } ],                                                                                756],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '460630', viewerCount: 456 }, { gameId: '506274', viewerCount: 789 }], 456],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '506274', viewerCount: 789 }],                                         0],

      (stats: GameStats[], expectedViewerCount: number) => {
        mockStatsService.subject.next(stats);
        assertRangeInResults(component.results[0], 0, 29, expectedViewerCount); // The first notification sets the entire range of values
      }
    );

    it('Rainbow Six\'s subsequent results are updated by adding an entry at the end and flushing the first entry.', () => {
      runSomeNotifications('460630', [7, 8, 9]);

      assertRangeInResults(component.results[0], 0, 27, 7); // The first 28 entries are '7's
      assertRangeInResults(component.results[0], 28, 28, 8); // The last two entries are '8'
      assertRangeInResults(component.results[0], 29, 29, 9); // and '9'
    });

    it('contains a second entry for Far Cry 5.', () => {
      mockStatsService.subject.next([]);
      expect(component.results[1].name).toEqual('Far Cry 5');
    });

    rit(
      'Far Cry 5\'s viewer count is updated whenever game stats for game id 497078 are received.',

      [[{ gameId: '497078', viewerCount: 756 } ],                                                                                756],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '460630', viewerCount: 456 }, { gameId: '506274', viewerCount: 789 }], 123],
      [[{ gameId: '460630', viewerCount: 123 }, { gameId: '506274', viewerCount: 789 }],                                         0],

      (stats: GameStats[], expectedViewerCount: number) => {
        mockStatsService.subject.next(stats);
        assertRangeInResults(component.results[1], 0, 29, expectedViewerCount); // The first notification sets the entire range of values
      }
    );

    it('Far Cry 5\'s subsequent results are updated by adding an entry at the end and flushing the first entry.', () => {
      runSomeNotifications('497078', [7, 8, 9]);

      assertRangeInResults(component.results[1], 0, 27, 7); // The first 28 entries are '7's
      assertRangeInResults(component.results[1], 28, 28, 8); // The last two entries are '8'
      assertRangeInResults(component.results[1], 29, 29, 9); // and '9'
    });

    it('contains a third entry for Assassin\'s Creed Odyssey.', () => {
      mockStatsService.subject.next([]);
      expect(component.results[2].name).toEqual(`Assassin's Creed Odyssey`);
    });

    rit(
      'Assassin\'s Creed Odyssey\'s viewer count is updated whenever game stats for game id 506274 are received.',

      [[{ gameId: '506274', viewerCount: 756 } ],                                                                                756],
      [[{ gameId: '497078', viewerCount: 123 }, { gameId: '506274', viewerCount: 456 }, { gameId: '460630', viewerCount: 789 }], 456],
      [[{ gameId: '460630', viewerCount: 123 }, { gameId: '497078', viewerCount: 789 }],                                         0],

      (stats: GameStats[], expectedViewerCount: number) => {
        mockStatsService.subject.next(stats);
        assertRangeInResults(component.results[2], 0, 29, expectedViewerCount); // The first notification sets the entire range of values
      }
    );

    it('Assassin\'s Creed Odyssey\'s subsequent results are updated by adding an entry at the end and flushing the first entry.', () => {
      runSomeNotifications('506274', [7, 8, 9]);

      assertRangeInResults(component.results[2], 0, 27, 7); // The first 28 entries are '7's
      assertRangeInResults(component.results[2], 28, 28, 8); // The last two entries are '8'
      assertRangeInResults(component.results[2], 29, 29, 9); // and '9'
    });
  });

  describe('showChart', () => {

    rit(
      'returns true only after the first time it is notified with real data.',

      [undefined,                                false],
      [[],                                       true],
      [[{ gameId: '506274', viewerCount: 756 }], true],

      (stats: GameStats[], expected: boolean) => {
        mockStatsService.subject.next(stats);
        expect(component.showChart).toEqual(expected);
      }
    );

  });

  function runSomeNotifications(gameId: string, values: number[]) {
    for (const value of values) {
      mockStatsService.subject.next([{ gameId, viewerCount: value }]);
    }
  }

  function assertRangeInResults(chartData: ChartData, startIndex: number, endIndex: number, expectedValue: number) {
    for (let i = startIndex; i <= endIndex; i++) {
      expect(chartData.series[i].name).toEqual(i);
      expect(chartData.series[i].value).toEqual(expectedValue);
    }
  }
});
