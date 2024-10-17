import { Modal } from "@/shared/types/Modal";

export type GameName = "tic-tac-toe" | "chess";

export type GameData = {
  opponentUsername: string;
  gameName: GameName;
};

export type GameModal = Modal & {
  gameData: GameData;
};

export const isGameName = (gameName: string): gameName is GameName => {
  return gameName === "tic-tac-toe" || gameName === "chess";
};
