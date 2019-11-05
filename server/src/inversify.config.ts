import 'reflect-metadata'; // This needs to always be the first import

import { Container } from 'inversify';
import { HttpClient } from './http-client/http-client';
import { NeedleHttpClient, NeedleHttpClientToken } from './http-client/needle-http-client';
import { ConcreteTimerFactory, ConcreteTimerFactoryToken } from './timer/concrete-timer-factory';
import { TimerFactory } from './timer/timer-factory';
import { GameStatsProvider } from './twitch/game-stats-provider';
import { GameStatsRegistry } from './twitch/game-stats-registry';
import { RealTimeGameStatsProvider } from './twitch/real-time-game-stats-provider';
import { TwitchGameStatsProvider, TwitchGameStatsProviderToken } from './twitch/twitch-game-stats-provider';
import { TwitchGameStatsRegistry, TwitchGameStatsRegistryToken } from './twitch/twitch-game-stats-registry';
import { TwitchRealTimeGameStatsProvider, TwitchRealTimeGameStatsProviderToken } from './twitch/twitch-real-time-game-stats-provider';
import { WebApi, WebApiToken } from './web-api';

const container: Container = new Container();

container.bind<WebApi>(WebApiToken).to(WebApi).inSingletonScope();
container.bind<HttpClient>(NeedleHttpClientToken).to(NeedleHttpClient).inSingletonScope();
container.bind<TimerFactory>(ConcreteTimerFactoryToken).to(ConcreteTimerFactory).inSingletonScope();

container.bind<GameStatsProvider>(TwitchGameStatsProviderToken).to(TwitchGameStatsProvider).inSingletonScope();
container.bind<RealTimeGameStatsProvider>(TwitchRealTimeGameStatsProviderToken).to(TwitchRealTimeGameStatsProvider).inSingletonScope();
container.bind<GameStatsRegistry>(TwitchGameStatsRegistryToken).to(TwitchGameStatsRegistry).inSingletonScope();

export { container };