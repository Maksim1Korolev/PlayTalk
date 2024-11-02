export type GameName = "tic-tac-toe" | "chess";

export type GameData = {
  opponentUsername: string;
  gameName: GameName;
};


export const isGameName = (gameName: string): gameName is GameName => {
  return gameName === "tic-tac-toe" || gameName === "chess";
};
