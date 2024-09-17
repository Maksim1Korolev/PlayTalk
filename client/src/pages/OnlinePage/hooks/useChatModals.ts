import { User } from "@/entities/User";

export interface ChatModalState {
  user: User;
  position: { x: number; y: number };
}
