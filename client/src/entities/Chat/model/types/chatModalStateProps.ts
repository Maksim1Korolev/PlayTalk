import { User } from "@/entities/User";

export type ChatModalStateProps = {
  user: User;
  position?: { x: number; y: number };
};
