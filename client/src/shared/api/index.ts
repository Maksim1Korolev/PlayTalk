export {
  $api,
  $authApi,
  $profileApi,
  $communicationApi,
  $gameApi,
} from "./services/api";
//There is no really a need for all the imports above except for the first one

export { usersApiService } from "./services/usersApiService";
export { onlineApiService } from "./services/onlineApiService";
export { chatApiService } from "./services/chatApiService";
export type { UnreadMessageCounts } from "./services/chatApiService";
export { gameApiService } from "./services/gameApiService";
export type { ActiveGames } from "./services/gameApiService";
