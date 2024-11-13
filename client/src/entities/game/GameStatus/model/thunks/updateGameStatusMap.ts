import { createAsyncThunk } from "@reduxjs/toolkit";

import { ThunkConfig } from "@/app/providers";
import { GameName } from "@/entities/game/Game/model";
import { getUsers, userActions } from "@/entities/User";

import { GameStatus } from "../types/gameStatus";

export const updateGameStatusMap = createAsyncThunk<
  {},
  {
    username: string;
    gameName: GameName;
    statusUpdate: Partial<GameStatus>;
  },
  ThunkConfig<string>
>(
  "gameStatus/updateGameStatusMap",
  async ({ username, gameName, statusUpdate }, { dispatch, getState }) => {
    //TODO:Update
    const state = getState();
    const users = getUsers(state);
    const user = users[username];

    const currentGameStatusMap = (user?.gameStatusMap ?? {}) as Record<
      GameName,
      GameStatus
    >;

    const currentGameStatus = currentGameStatusMap[gameName] ?? {};

    const updatedGameStatusMap: Record<GameName, GameStatus> = {
      ...currentGameStatusMap,
      [gameName]: {
        ...currentGameStatus,
        ...statusUpdate,
      },
    };

    dispatch(
      userActions.updateUser({
        username,
        updatedProps: {
          gameStatusMap: updatedGameStatusMap,
        },
      })
    );
  }
);
