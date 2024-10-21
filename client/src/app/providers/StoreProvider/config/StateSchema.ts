import { UserState } from "@/entities/User"
import { CircleMenuState } from '@/features/UserList/model/types/circleMenu'

export interface StateSchema {
  user: UserState;
	circleMenu: CircleMenuState;
}
