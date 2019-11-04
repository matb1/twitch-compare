import { HttpClient, HttpOptions, HttpResponse } from './../http-client/http-client';
import { NeedleHttpClientToken } from './../http-client/needle-http-client';
import { inject, injectable } from './../inversify.decorators';
import { GameStats, GameStatsProvider } from './game-stats-provider';

export const TwitchGameStatsProviderToken = Symbol('TwitchGameStatsProvider');

export interface TwitchStreamsResponse {
  data: Array<{ game_id: string, viewer_count: number }>;
  pagination: { cursor: string };
}

@injectable()
export class TwitchGameStatsProvider implements GameStatsProvider {

  private readonly url: string = 'https://api.twitch.tv/helix/streams';

  constructor(@inject(NeedleHttpClientToken) private http: HttpClient) {
  }

  public async get(gameIds: string[]): Promise<GameStats[]> {
    if (gameIds.length === 0) {
      return [];
    }

    const urlParams: string = gameIds.map((value) => `game_id=${value}`).join('&');
    const url: string = `${this.url}?${urlParams}&first=100`;
    const options: HttpOptions = {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID || ''
      }
    };

    return this.fetchStats(url, options);
  }

  private async fetchStats(url: string, options: HttpOptions, cursor?: string, map?: Map<string, GameStats>): Promise<GameStats[]> {
    const newUrl: string = (cursor) ? `${url}&after=${cursor}` : url;

    const response: HttpResponse = await this.http.get(newUrl, options);

    if (response.status !== 200) {
      throw new Error(`HTTP GET ${url} failed with status ${response.status}.`);
    }

    map = map || new Map<string, GameStats>();

    const body: TwitchStreamsResponse = response.body;
    for (const streamData of body.data) {
      if (streamData.game_id) {
        const stats: GameStats = map.get(streamData.game_id);

        if (stats !== undefined) {
          stats.viewerCount += streamData.viewer_count || 0;
        } else {
          map.set(streamData.game_id, { gameId: streamData.game_id, viewerCount: streamData.viewer_count || 0 });
        }
      }
    }

    // The Twitch API returns a cursor value, to be used in a subsequent request to specify the starting point of the next set of results.
    // If we received a cursor value, that means we must do another HTTP call, thus we recursively call this method.
    // Else we fetched the entire set of results and we can end the recursion.
    if (body.pagination && body.pagination.cursor) {
      return this.fetchStats(url, options, body.pagination.cursor, map);
    } else {
      return Array.from(map.values());
    }
  }

}