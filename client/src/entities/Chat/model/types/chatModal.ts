import { User } from "@/entities/User";
import { Modal } from "@/shared/types/Modal";

export type ChatModal = Modal & {
  user: User;
};
