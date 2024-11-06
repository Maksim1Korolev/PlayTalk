import { User } from "@/entities/User";

export interface Message {
  _id?: string;
  message: string;
  date: Date;
  username: string;
  readAt?: Date;
}

export type ChatModalData = {
  user: User;
};
