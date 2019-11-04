export interface GameStats {
  gameId: string;
  viewerCount: number;
}

export interface GameStatsProvider {
  get(gameIds: string[]): Promise<GameStats[]>;
}