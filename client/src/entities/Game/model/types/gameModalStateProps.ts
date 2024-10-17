export type GameName = "tic-tac-toe" | "chess";

export type GameData = {
  gameName: GameName;
  opponentUsername: string;
};

export type GameModalStateProps = {
  gameData: GameData;
  position?: {
    x: number;
    y: number;
  };
};

export const isGameName = (gameName: string): gameName is GameName => {
  return gameName === "tic-tac-toe" || gameName === "chess";
};