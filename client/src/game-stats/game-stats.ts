export interface GameStats {
  gameId: string;
  viewerCount: number;
}

export enum GameId {
  RainbowSixSiege = '460630',
  FarCry5 = '497078',
  AssassinsCreedOdyssey = '506274'
}

export let GameDatabase = {
  [GameId.RainbowSixSiege]: {
    title: `Tom Clancy's Rainbow Six: Siege`,
    dev: 'Ubisoft',
    link: `https://www.twitch.tv/directory/game/Tom%20Clancy's%20Rainbow%20Six%3A%20Siege`
  },
  [GameId.FarCry5]: {
    title: 'Far Cry 5',
    dev: 'Ubisoft',
    link: `https://www.twitch.tv/directory/game/Far%20Cry%205`
  },
  [GameId.AssassinsCreedOdyssey]: {
    title: `Assassin's Creed Odyssey`,
    dev: 'Ubisoft',
    link: `https://www.twitch.tv/directory/game/Assassin's%20Creed%20Odyssey`
  }
};
