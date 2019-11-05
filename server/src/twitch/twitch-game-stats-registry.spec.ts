import { arit, rit } from './../jasmine-extensions';
import { GameStats } from './game-stats-provider';
import { RealTimeGameStatsProviderMock } from './real-time-game-stats-provider.mock';
import { TwitchGameStatsRegistry } from './twitch-game-stats-registry';

describe('The TwitchGameStatsRegistry', () => {

  let registry: TwitchGameStatsRegistry;
  let mockRealTimeStatsProvider: RealTimeGameStatsProviderMock;

  beforeEach(() => {
    mockRealTimeStatsProvider = new RealTimeGameStatsProviderMock();
    registry = new TwitchGameStatsRegistry(mockRealTimeStatsProvider);
  });

  describe('on a call to subscribe()', () => {

    it('returns a subscription id.', () => {
      const actual = runSubscribe();

      expect(actual).toEqual(1);
    });

    it('increments the subscription id.', () => {
      runSubscribe();
      runSubscribe();
      const actual = runSubscribe();

      expect(actual).toEqual(3);
    });

    it('starts the real-time stats monitoring on the first call to subscribe.', () => {
      runSubscribe();

      expect(mockRealTimeStatsProvider.startCallCount).toEqual(1);
    });

    it('only starts the real-time stats monitoring on the first call to subscribe.', () => {
      runSubscribe();
      runSubscribe();
      runSubscribe();

      expect(mockRealTimeStatsProvider.startCallCount).toEqual(1);
    });

    arit(
      'provides the subscribers with the real-time stats whenever they change.',

      [[{ gameId: 'a', viewerCount: 12}]],
      [[{ gameId: 'b', viewerCount: 13}, { gameId: 'c', viewerCount: 14}]],

      (expected: GameStats[], done: DoneFn) => {

        registry.subscribe((actual) => {
          expect(actual).toEqual(expected);
          done();
        });

        mockRealTimeStatsProvider.startRecordedParameter.callback(expected);
      }
    );

    it('provides all the subscribers with the real-time stats.', () => {
      let subscriber1CallCount: number = 0;
      registry.subscribe(() => {
        subscriber1CallCount++;
      });

      let subscriber2CallCount: number = 0;
      registry.subscribe(() => {
        subscriber2CallCount++;
      });

      let subscriber3CallCount: number = 0;
      registry.subscribe(() => {
        subscriber3CallCount++;
      });

      mockRealTimeStatsProvider.startRecordedParameter.callback([]);

      expect(subscriber1CallCount).toEqual(1);
      expect(subscriber2CallCount).toEqual(1);
      expect(subscriber3CallCount).toEqual(1);
    });

  });

  describe('on a call to unsubscribe()', () => {

    it('stops the real-time stats monitoring if there are no subscribers left.', () => {
      const id = runSubscribe();
      runUnsubscribe(id);

      expect(mockRealTimeStatsProvider.stopCallCount).toEqual(1);
    });

    it('does nothing if the id provided is invalid.', () => {
      runSubscribe();
      runUnsubscribe(47);

      expect(mockRealTimeStatsProvider.stopCallCount).toEqual(0);
    });

    it('does not stop the real-time stats monitoring if there are still subscribers left.', () => {
      runSubscribe();
      const id = runSubscribe();
      runSubscribe();
      runUnsubscribe(id);

      expect(mockRealTimeStatsProvider.stopCallCount).toEqual(0);
    });

    rit(
      'removes the subscriber from the list of subsribers.',

      // subscriberToRemove, expectedSubscriber1CallCount, expectedSubscriber2CallCount, expectedSubscriber3CallCount
      [1,                    0,                            1,                            1],
      [2,                    1,                            0,                            1],
      [3,                    1,                            1,                            0],
      [4,                    1,                            1,                            1],

      (subscriberToRemove: number, expectedSubscriber1CallCount: number, expectedSubscriber2CallCount: number, expectedSubscriber3CallCount: number) => {
        let subscriber1CallCount: number = 0;
        registry.subscribe(() => {
          subscriber1CallCount++;
        });

        let subscriber2CallCount: number = 0;
        registry.subscribe(() => {
          subscriber2CallCount++;
        });

        let subscriber3CallCount: number = 0;
        registry.subscribe(() => {
          subscriber3CallCount++;
        });

        runUnsubscribe(subscriberToRemove);
        mockRealTimeStatsProvider.startRecordedParameter.callback([]);

        expect(subscriber1CallCount).toEqual(expectedSubscriber1CallCount);
        expect(subscriber2CallCount).toEqual(expectedSubscriber2CallCount);
        expect(subscriber3CallCount).toEqual(expectedSubscriber3CallCount);
      }
    );

  });

  function runSubscribe(): number {
    return registry.subscribe(() => {
      // Do nothing
    });
  }

  function runUnsubscribe(id: number): void {
    return registry.unsubscribe(id);
  }

});