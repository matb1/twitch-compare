import * as express from 'express';
import * as http from 'http';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import * as io from 'socket.io';
import { GameStats, GameStatsProvider } from './twitch/game-stats-provider';
import { GameStatsRegistry } from './twitch/game-stats-registry';
import { TwitchGameStatsProviderToken } from './twitch/twitch-game-stats-provider';
import { TwitchGameStatsRegistryToken } from './twitch/twitch-game-stats-registry';

export const WebApiToken = Symbol('WebApi');

const ClientPath: string = path.join(__dirname, '../../client/dist/client');

@injectable()
export class WebApi {

  constructor(
    @inject(TwitchGameStatsProviderToken) private gameStatsProvider: GameStatsProvider,
    @inject(TwitchGameStatsRegistryToken) private gameStatsRegistry: GameStatsRegistry,
  ) {
  }

  public installRoutes(server: http.Server, app: express.Express) {

    // Serve client HTML
    app.use('/', express.static(ClientPath));

    // Serve client static files
    app.get('/', (req, res) => {
      res.sendFile(path.join(ClientPath, 'index.html'));
    });

    // Handle GET /twitch/stats
    app.get('/twitch/stats', (req, res) => {
      this.gameStatsProvider.get(['497078', '506274', '460630']).then((stats: GameStats[]) => {
        res.json(stats);
      }).catch(() => {
        res.status(500).json({ error: 'Failed to fetch the game stats' });
      });
    });

    // Handle web socket connections
    io(server).on('connection', (socket: io.Socket) => {
      const id = this.gameStatsRegistry.subscribe((stats) => {
        socket.emit('/twitch/stats', stats);
      });

      socket.on('disconnect', () => {
        this.gameStatsRegistry.unsubscribe(id);
      });
    });
  }
}