import { cx } from "@/shared/lib/cx";
import cls from "./ChatInput.module.scss";

interface ChatInputProps {
  className?: string;
  placeholder?: string;
  onSend: (message: string) => void;
  onTyping: () => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
}

export const ChatInput = ({
  className,
  placeholder = "Type your message...",
  onSend,
  onTyping,
  inputMessage,
  setInputMessage,
}: ChatInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    onTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSend(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className={cx(cls.ChatInput, {}, [className])}>
      <textarea
        className={cx(cls.chatInputField)}
        value={inputMessage}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <button className={cls.sendButton} onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};
