import { User } from "@/entities/User";

export interface ChatModalStateProps {
  user: User;
  position: { x: number; y: number };
}
