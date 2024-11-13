export interface ChatState {
  chats: Record<string, Chat>;
}

export interface Message {
  _id?: string;
  message: string;
  date: string;
  username: string;
  readAt?: string;
}

export interface Chat {
  messages: Message[];
  isTyping?: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export type ChatModalData = {
  recipientUsername: string;
};
