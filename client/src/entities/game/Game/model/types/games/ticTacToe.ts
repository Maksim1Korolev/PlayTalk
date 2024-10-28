import { GameBase } from "../game";

export type TicTacToePlayer = {
  username: string;
  sign: "O" | "X";
};

export interface TicTacToeGame extends GameBase {
  gameName: "tic-tac-toe";
  player1: TicTacToePlayer;
  player2: TicTacToePlayer;
  currentPlayer: string;
  board: Array<"-" | "O" | "X">;
}
