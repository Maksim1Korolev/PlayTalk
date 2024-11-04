import { ChatModalData } from '@/entities/Chat'
import { GameModalData } from '@/entities/game/Game'

export interface ModalState {
	modals: Modal[],
	modalCount: number
	modalMaxCount: number
}


export interface Modal<T = ModalData> {
	modalId: string;
	position?: {
    x: number;
    y: number;
  };
	data: T
}

export type ModalData = ChatModalData | GameModalData ;