import { RootState } from '@/app/providers/StoreProvider/config/store'

export const selectActiveMenuId = (state: RootState) => state.circleMenu.activeMenuId;