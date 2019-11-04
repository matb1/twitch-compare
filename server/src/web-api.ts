import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { GameStats, GameStatsProvider } from './twitch/game-stats-provider';
import { TwitchGameStatsProviderToken } from './twitch/twitch-game-stats-provider';

export const WebApiToken = Symbol('WebApi');

const ClientPath: string = path.join(__dirname, '../../client/dist/client');

@injectable()
export class WebApi {

  constructor(@inject(TwitchGameStatsProviderToken) private gameStatsProvider: GameStatsProvider) {
  }

  public installRoutes(app: express.Express) {

    app.use('/', express.static(ClientPath));

    app.get('/', (req, res) => {
      res.sendFile(path.join(ClientPath, 'index.html'));
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