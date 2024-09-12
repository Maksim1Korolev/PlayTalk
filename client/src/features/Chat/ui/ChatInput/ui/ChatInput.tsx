import { cx } from "@/shared/lib/cx";
import cls from "./ChatInput.module.scss";

interface ChatInputProps {
  className?: string;
  placeholder?: string;
  onSend: (message: string) => void; // This will call sendMessage
  onTyping: () => void; // This will call notifyTyping
  inputMessage: string; // The message text passed from the parent (e.g., for the chat modal)
  setInputMessage: (message: string) => void; // Parent manages the inputMessage state
}

export const ChatInput = ({
  className,
  placeholder = "Type your message...",
  onSend,
  onTyping,
  inputMessage,
  setInputMessage,
}: ChatInputProps) => {
  // Handle typing event
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value); // Updating the inputMessage in the parent
    onTyping(); // Notify other users that the current user is typing
  };

  // Send message when Enter is pressed
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default new line behavior
      handleSendMessage();
    }
  };

  // Send the message when the send button is clicked or Enter is pressed
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSend(inputMessage); // This calls the parent's sendMessage function
      setInputMessage(""); // Clear input field after sending
    }
  };

  return (
    <div className={cx(cls.ChatInput, {}, [className])}>
      <textarea
        className={cx(cls.textarea)}
        value={inputMessage} // Controlled input from parent
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
