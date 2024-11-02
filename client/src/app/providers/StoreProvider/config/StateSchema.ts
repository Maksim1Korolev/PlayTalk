import { InviteState } from "@/entities/game/Invite"
import { ModalState } from '@/entities/Modal'
import { UserState } from "@/entities/User"
import { CircleMenuState } from '@/features/UserList/model/types/circleMenu'
import { AxiosInstance } from 'axios'

export interface StateSchema {
  user: UserState;
  invite: InviteState;
	circleMenu: CircleMenuState;
	modal: ModalState
}

export interface ThunkExtraArg {
	api: AxiosInstance;
}