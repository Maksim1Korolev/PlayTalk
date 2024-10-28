import { Player } from "../../TicTacToe/model";

interface GameBase {
  gameName: string;
}

export interface TicTacToeGame extends GameBase {
  gameName: "tic-tac-toe";
  player1: Player;
  player2: Player;
  currentPlayer: string;
  board: Array<"-" | "O" | "X">;
}

//Another game example
export interface ChessGame extends GameBase {
  gameName: "chess";
}

export type Game = TicTacToeGame | ChessGame;

