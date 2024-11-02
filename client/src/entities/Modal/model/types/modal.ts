import { ChatData } from '@/entities/Chat'
import { GameData } from '@/entities/game/Game'

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

export type ModalData = ChatData | GameData ;