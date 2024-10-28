import { TicTacToeGame } from "./games/ticTacToe";

export interface GameBase {
  gameName: string;
}

//Another game example
export interface ChessGame extends GameBase {
  gameName: "chess";
}

export type Game = TicTacToeGame | ChessGame;
