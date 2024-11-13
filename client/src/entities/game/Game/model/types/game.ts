import { TicTacToeGame } from "./games/ticTacToe";

export interface GameBase {
  gameName: string;
}

//Another game example
export interface ChessGame extends GameBase {
  gameName: "chess";
}

export type Game = TicTacToeGame | ChessGame;
export type GameName = "tic-tac-toe" | "chess";

export type GameData = {
  opponentUsername: string;
  gameName: GameName;
};

export const isGameName = (gameName: string): gameName is GameName => {
  return gameName === "tic-tac-toe" || gameName === "chess";
};
