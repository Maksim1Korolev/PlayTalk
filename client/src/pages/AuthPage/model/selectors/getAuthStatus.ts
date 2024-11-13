import { createSelector } from "reselect";

import { StateSchema } from "@/app/providers";

const getAuthState = (state: StateSchema) => state.auth;

export const getAuthStatuses = createSelector([getAuthState], (auth) => ({
  isAuthenticated: auth.isAuthenticated,
  loading: auth.loading,
  error: auth.error,
}));
