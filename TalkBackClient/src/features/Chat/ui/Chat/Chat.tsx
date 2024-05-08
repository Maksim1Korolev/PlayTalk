import { cx } from "@/shared/lib/cx";
import { Card, HStack, UiButton, UiText, VStack } from "@/shared/ui";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import SendIcon from "@mui/icons-material/Send";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { Message } from "../ChatMessage/ui/ChatMessage";
import cls from "./Chat.module.scss";

export const Chat = memo(
  ({
    className,
    messageHistory,
    currentUsername,
    receiverUsername,
    handleSendMessage,

    onClose,
    onCollapse,
  }: {
    className?: string;
    messageHistory?: Message[];
    currentUsername?: string;
    receiverUsername?: string;
    handleSendMessage: (message: string) => void;
    onClose: () => void;
    onCollapse: () => void;
  }) => {
    const [inputMessage, setInputMessage] = useState<string>("");

    const messageRefs = useRef(
      new Map<string, React.RefObject<HTMLDivElement>>()
    );
    const firstUnreadMessageRef =
      useRef<React.RefObject<HTMLDivElement> | null>(null);

    const scrollToBottom = useCallback(() => {
      firstUnreadMessageRef.current?.current?.scrollIntoView({
        behavior: "smooth",
      });
      if (firstUnreadMessageRef.current) {
        //setReadAt(firstUnreadMessageRef.current.id);
      }
    }, [firstUnreadMessageRef]);

    const handleSendButton = useCallback(() => {
      handleSendMessage(inputMessage);
      setInputMessage("");
    }, [handleSendMessage, inputMessage]);

    useEffect(() => {
      const firstUnreadMessage = messageHistory?.find(
        message => message.username !== currentUsername && !message.readAt
      );
      const unreadRef = messageRefs.current.get(firstUnreadMessage?._id || "");
      if (unreadRef) {
        firstUnreadMessageRef.current = unreadRef;
      } else {
        firstUnreadMessageRef.current = null;
      }
    }, [messageHistory, currentUsername]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
          if (event.shiftKey) return;
          event.preventDefault(); // Prevent new line in input
          console.log("Enter key was pressed");
          handleSendButton();
        }
      },
      [handleSendButton]
    );
    useEffect(() => {
      scrollToBottom();
    }, [messageHistory?.length, scrollToBottom]);

    const renderMessageHistory = useCallback(() => {
      return messageHistory?.map((message, index) => (
        <ChatMessage
          ref={messageRefs.current.get(message._id || "")}
          message={message}
          key={`${index} ${message.date}`}
          isRight={currentUsername == message.username}
        />
      ));
    }, [messageHistory, currentUsername]);

    return (
      <VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
        <HStack className={cx(cls.chatBoxHeader, {}, ["drag-handle"])} max>
          <UiText max>{receiverUsername}</UiText>
          <HStack className={cls.controlButtons}>
            <UiButton
              variant="clear"
              onClick={onCollapse}
              className={cls.chatBoxToggle}
            >
              <DoDisturbOnIcon />
            </UiButton>
            <UiButton
              variant="clear"
              onClick={onClose}
              className={cls.chatBoxToggle}
            >
              <CancelIcon />
            </UiButton>
          </HStack>
        </HStack>

        <Card
          className={cx(cls.chatBoxBody)}
          border="default"
          variant="light"
          max
        >
          <div className={cls.chatBoxOverlay}></div>
          <div className={cls.chatLogs}>
            {renderMessageHistory()}
            <div />
          </div>
        </Card>
        <div className={cls.chatInput} onKeyDown={handleKeyDown}>
          <ChatInput
            className={cls.chatInput}
            text={inputMessage}
            placeholder="Type your message here..."
            onChange={e => setInputMessage(e)}
          />

          <UiButton
            className={cls.chatSubmit}
            variant="clear"
            onClick={handleSendButton}
          >
            <SendIcon />
          </UiButton>
        </div>
      </VStack>
    );
  }
);
