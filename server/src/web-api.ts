import * as express from 'express';
import { inject, injectable } from 'inversify';
import { GameStats, GameStatsProvider } from './twitch/game-stats-provider';
import { TwitchGameStatsProviderToken } from './twitch/twitch-game-stats-provider';

export const WebApiToken = Symbol('WebApi');

@injectable()
export class WebApi {

  constructor(@inject(TwitchGameStatsProviderToken) private gameStatsProvider: GameStatsProvider) {
  }

  public installRoutes(app: express.Express) {
    app.get('/', (req, res) => {
      res.send('<h1>Hello world</h1>');
    });

    app.get('/twitch/stats', (req, res) => {
      this.gameStatsProvider.get(['497078', '506274', '460630']).then((stats: GameStats[]) => {
        res.json(stats);
      }).catch(() => {
        res.status(500).json({ error: 'Failed to fetch the game stats' });
      });
    });
  }
}