import { HttpClientMock } from './../http-client/http-client.mock';
import { arit } from './../jasmine-extensions';
import { GameStats } from './game-stats-provider';
import { TwitchGameStatsProvider } from './twitch-game-stats-provider';

describe('The TwitchGameStatsProvider', () => {

  let provider: TwitchGameStatsProvider;
  let mockHttpClient: HttpClientMock;

  beforeEach(() => {
    mockHttpClient = new HttpClientMock();
    provider = new TwitchGameStatsProvider(mockHttpClient);
  });

  afterEach(() => {
    delete process.env.TWITCH_CLIENT_ID;
  });

  describe('on a call to get()', () => {

    it('does nothing if no game IDs are passed', async (done: DoneFn) => {
      const actual = await provider.get([]);

      expect(mockHttpClient.getCallCount).toEqual(0);
      expect(actual).toEqual([]);
      done();
    });

    arit(
      'performs an HTTP GET with the right url.',

      [['12345'], 'https://api.twitch.tv/helix/streams?game_id=12345&first=100'],
      [['827345'], 'https://api.twitch.tv/helix/streams?game_id=827345&first=100'],
      [['12345', '827345'], 'https://api.twitch.tv/helix/streams?game_id=12345&game_id=827345&first=100'],
      [['6579', '46498', '999623'], 'https://api.twitch.tv/helix/streams?game_id=6579&game_id=46498&game_id=999623&first=100'],

      async (gameIds: string[], expectedUrl: string, done: DoneFn) => {
        setupHttpResponse();

        await provider.get(gameIds);

        expect(mockHttpClient.getCallCount).toEqual(1);
        expect(mockHttpClient.getRecordedParameter.url).toEqual(expectedUrl);
        done();
      }
    );

    arit(
      'sets the Client-ID in the HTTP header using the TWITCH_CLIENT_ID environment variable.',

      ['abababa'],
      ['1234asf5253'],

      async (clientId: string, done: DoneFn) => {
        setupHttpResponse();
        process.env.TWITCH_CLIENT_ID = clientId;

        await runGet();

        expect(mockHttpClient.getRecordedParameter.options.headers['Client-ID']).toEqual(clientId);
        done();
      }
    );

    it('sets the Client-ID to \'\' in the HTTP header if the TWITCH_CLIENT_ID environment variable is not set.', async (done: DoneFn) => {
      setupHttpResponse();

      await runGet();

      expect(mockHttpClient.getRecordedParameter.options.headers['Client-ID']).toEqual('');
      done();
    });

    arit(
      'returns an empty array if the HTTP response status code is not 200.',

      [400],
      [500],

      (status: number, done: DoneFn) => {
        setupHttpResponse(status);

        runGet().then((stats) => {
          expect(stats).toEqual([]);
          done();
        });
      }
    );

    arit(
      'sums up the viewer count of all the streams returned by the API call and returns it as the viewer count for the specified game.',

      // streamData,                                                                                               expected
      [ [{ viewer_count: 108, game_id: '1' }],                                                                     [{ viewerCount: 108, gameId: '1' }] ],
      [ [{ viewer_count: 1423, game_id: '37' }],                                                                   [{ viewerCount: 1423, gameId: '37' }] ],
      [ [{ viewer_count: 6, game_id: '4' }, { viewer_count: 4, game_id: '4' }],                                    [{ viewerCount: 10, gameId: '4' }] ],
      [ [{ viewer_count: 9, game_id: '1' }, { viewer_count: 45, game_id: '2' }],                                   [{ viewerCount: 9, gameId: '1' }, { viewerCount: 45, gameId: '2' }] ],
      [ [{ viewer_count: 3, game_id: '1' }, { viewer_count: 5, game_id: '2' }, { viewer_count: 4, game_id: '1' }], [{ viewerCount: 7, gameId: '1' }, { viewerCount: 5, gameId: '2' }] ],
      [ [{ viewer_count: 2, game_id: '1' }, { }, { viewer_count: 4, game_id: '2' }],                               [{ viewerCount: 2, gameId: '1' }, { viewerCount: 4, gameId: '2' }] ],

      async (streamData: any, expected: GameStats[], done: DoneFn) => {
        setupHttpResponseBody({ data: streamData });

        const actual: GameStats[] = await runGet();

        expect(actual).toEqual(expected);
        done();
      }
    );

    it('gets the entire set of results using the \'pagination\' metadata.', async (done: DoneFn) => {
      setupMultipleHttpResponseBodies([
        { data: [{ viewer_count: 1,  game_id: '1' }], pagination: { cursor: '1223' } },
        { data: [{ viewer_count: 8, game_id: '1' }, { viewer_count: 3, game_id: '2' }], pagination: { cursor: '45678' } },
        { data: [{ viewer_count: 1, game_id: '2' }], pagination: { cursor: '9874' } },
        { data: [], pagination: {} },
      ]);

      const actual: GameStats[] = await runGet(['1', '2']);

      expect(mockHttpClient.getCallCount).toEqual(4);
      expect(mockHttpClient.getRecordedParameters[0].url).toEqual('https://api.twitch.tv/helix/streams?game_id=1&game_id=2&first=100');
      expect(mockHttpClient.getRecordedParameters[1].url).toEqual('https://api.twitch.tv/helix/streams?game_id=1&game_id=2&first=100&after=1223');
      expect(mockHttpClient.getRecordedParameters[2].url).toEqual('https://api.twitch.tv/helix/streams?game_id=1&game_id=2&first=100&after=45678');
      expect(mockHttpClient.getRecordedParameters[3].url).toEqual('https://api.twitch.tv/helix/streams?game_id=1&game_id=2&first=100&after=9874');
      expect(actual).toEqual([{ viewerCount: 9, gameId: '1' }, { viewerCount: 4, gameId: '2' }]);
      done();
    });

    function setupHttpResponse(status: number = 200) {
      mockHttpClient.getReturnValue = { status, body: { data: [{ viewer_count: 1, game_id: '1' }]}, headers: {}};

    }

    function setupHttpResponseBody(body: any) {
      mockHttpClient.getReturnValue = { status: 200, body, headers: {}};
    }

    function setupMultipleHttpResponseBodies(bodies: any[]) {
      mockHttpClient.getReturnValues = bodies.map((body) => ({ status: 200, headers: {}, body }));
    }

    function runGet(gameIds: string[] = ['12345']): Promise<GameStats[]> {
      return provider.get(gameIds);
    }

  });

});