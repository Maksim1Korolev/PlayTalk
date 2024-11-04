import { InviteState } from "@/entities/game/Invite";
import { ModalState } from '@/entities/Modal';
import { UserState } from "@/entities/User";
import { CircleMenuState } from '@/features/UserList/model/types/circleMenu';
import { chatApiService, gameApiService, onlineApiService, usersApiService } from '@/shared/api';


export interface ThunkExtraArg {
  api: {
    usersApiService: typeof usersApiService;
    onlineApiService: typeof onlineApiService;
    chatApiService: typeof chatApiService;
    gameApiService: typeof gameApiService;
  };
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: StateSchema;
}


export interface StateSchema {
  user: UserState;
  invite: InviteState;
	circleMenu: CircleMenuState;
	modal: ModalState
}

