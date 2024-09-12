export type Game = {
  gameName: "TicTacToe";
  player1: Player;
  player2: Player;
  currentPlayer: string;
  board: Array<"-" | "O" | "X">;
};
