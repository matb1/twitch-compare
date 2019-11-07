import { arit } from './../jasmine-extensions';
import { TimerFactoryMock } from './../timer/timer-factory.mock';
import { TimerMock } from './../timer/timer.mock';
import { GameStats } from './game-stats-provider';
import { GameStatsProviderMock } from './game-stats-provider.mock';
import { TwitchRealTimeGameStatsProvider } from './twitch-real-time-game-stats-provider';

describe('The TwitchRealTimeGameStatsProvider', () => {

  let provider: TwitchRealTimeGameStatsProvider;
  let mockGameStatsProvider: GameStatsProviderMock;
  let mockTimer: TimerMock;
  let mockTimerFactory: TimerFactoryMock;

  beforeEach(() => {
    mockGameStatsProvider = new GameStatsProviderMock();
    mockGameStatsProvider.getReturnValue = [];
    mockTimer = new TimerMock();
    mockTimerFactory = new TimerFactoryMock();
    mockTimerFactory.pollingReturnValue = mockTimer;

    provider = new TwitchRealTimeGameStatsProvider(mockGameStatsProvider, mockTimerFactory);
  });

  describe('on a call to start()', () => {

    it('starts a polling timer configured to periods of 1 seconds.', () => {
      runStart();

      expect(mockTimer.startCallCount).toEqual(1);
      expect(mockTimer.startRecordedParameter.timeout).toEqual(1000);
    });

    it('does nothing when already started.', () => {
      runStart();
      runStart();

      expect(mockTimer.startCallCount).toEqual(1);
    });

    arit(
      'calls the callback with the fetched set of stats.',

      [[{ gameId: 'a', viewerCount: 12}]],
      [[{ gameId: 'b', viewerCount: 13}, { gameId: 'c', viewerCount: 14}]],

      (expected: GameStats[], done: DoneFn) => {
        mockGameStatsProvider.getReturnValue = expected;

        provider.start((actual: GameStats[]) => {
          expect(actual).toEqual(expected);
          done();
        });

        mockTimer.startRecordedParameter.callback();
      }
    );

    it('fetches a new set of stats each time the timer expires.', () => {
      runStart();
      mockTimer.startRecordedParameter.callback();
      mockTimer.startRecordedParameter.callback();
      mockTimer.startRecordedParameter.callback();

      expect(mockGameStatsProvider.getCallCount).toEqual(3);
      expect(mockGameStatsProvider.getRecordedParameter.gameIds).toEqual(['497078', '506274', '460630']);
    });

    arit(
      'only calls the callback on subsequent fetches if the stats have changed.',

      // firstFetch,                                                          secondFetch,                                                         expectedCallCount
      [  [{ gameId: 'a', viewerCount: 12 }],                                  [{ gameId: 'a', viewerCount: 12 }],                                  0],
      [  [{ gameId: 'a', viewerCount: 12 }],                                  [{ gameId: 'b', viewerCount: 12 }],                                  1],
      [  [{ gameId: 'a', viewerCount: 12 }],                                  [{ gameId: 'a', viewerCount: 13 }],                                  1],

      [  [{ gameId: 'b', viewerCount: 13 }, { gameId: 'c', viewerCount: 14}], [{ gameId: 'c', viewerCount: 14}, { gameId: 'b', viewerCount: 13 }], 0],
      [  [{ gameId: 'b', viewerCount: 13 }, { gameId: 'c', viewerCount: 14}], [{ gameId: 'c', viewerCount: 14} ],                                  1],
      [  [{ gameId: 'b', viewerCount: 13 }, { gameId: 'c', viewerCount: 14}], [{ gameId: 'c', viewerCount: 13}, { gameId: 'b', viewerCount: 13 }], 1],
      [  [{ gameId: 'b', viewerCount: 13 }, { gameId: 'c', viewerCount: 14}], [{ gameId: 'b', viewerCount: 14}, { gameId: 'b', viewerCount: 13 }], 1],
      [  [{ gameId: 'b', viewerCount: 13 }, { gameId: 'c', viewerCount: 14}], [{ gameId: 'b', viewerCount: 13}, { gameId: 'b', viewerCount: 13 }], 1],

      (firstFetch: GameStats[], secondFetch: GameStats[], expectedCallCount: number, done: DoneFn) => {
        mockGameStatsProvider.getReturnValues = [firstFetch, secondFetch];

        let actualCallCount: number = 0;
        provider.start(() => {
          actualCallCount++;
        });
        mockTimer.startRecordedParameter.callback();

        setImmediate(() => {
          mockTimer.startRecordedParameter.callback();

          setImmediate(() => {
            expect(actualCallCount - 1).toEqual(expectedCallCount); // The first fetch always calls the callback at least one time
            done();
          });
        });
      }
    );

  });

  describe('on a call to stop()', () => {
    it('stops the periodic timer.', () => {
      runStart();

      runStop();

      expect(mockTimer.stopCallCount).toEqual(1);
    });

    it('does nothing when not started.', () => {
      runStop();

      expect(mockTimer.stopCallCount).toEqual(0);
    });

    it('does nothing when already stopped.', () => {
      runStart();

      runStop();
      runStop();

      expect(mockTimer.stopCallCount).toEqual(1);
    });

    it('can be restarted afterwards.', () => {
      runStart();

      runStop();
      runStart();

      expect(mockTimer.startCallCount).toEqual(2);
    });
  });

  function runStart(): void {
    provider.start(() => {
      // Do nothing
    });
  }

  function runStop(): void {
    provider.stop();
  }

});