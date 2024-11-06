import { RootState } from "@/app/providers/StoreProvider/config/store";

export const getUsersLoadingStatus = (state: RootState) => ({
  isLoading: state.user.isLoading,
  isError: state.user.isError,
  errorMessage: state.user.errorMessage,
});
