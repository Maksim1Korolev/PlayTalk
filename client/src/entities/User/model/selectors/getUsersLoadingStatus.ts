import { createSelector } from "reselect";

import { RootState } from "@/app/providers/StoreProvider/config/store";

const selectIsLoading = (state: RootState) => state.user.isLoading;
const selectIsError = (state: RootState) => state.user.isError;
const selectErrorMessage = (state: RootState) => state.user.errorMessage;

export const getUsersLoadingStatus = createSelector(
  [selectIsLoading, selectIsError, selectErrorMessage],
  (isLoading, isError, errorMessage) => ({
    isLoading,
    isError,
    errorMessage,
  })
);
