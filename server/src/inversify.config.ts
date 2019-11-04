import 'reflect-metadata'; // This needs to always be the first import

import { Container } from 'inversify';
import { HttpClient } from './http-client/http-client';
import { NeedleHttpClient, NeedleHttpClientToken } from './http-client/needle-http-client';
import { GameStatsProvider } from './twitch/game-stats-provider';
import { TwitchGameStatsProvider, TwitchGameStatsProviderToken } from './twitch/twitch-game-stats-provider';
import { WebApi, WebApiToken } from './web-api';

const container: Container = new Container();

container.bind<WebApi>(WebApiToken).to(WebApi).inSingletonScope();
container.bind<HttpClient>(NeedleHttpClientToken).to(NeedleHttpClient).inSingletonScope();
container.bind<GameStatsProvider>(TwitchGameStatsProviderToken).to(TwitchGameStatsProvider).inSingletonScope();

export { container };