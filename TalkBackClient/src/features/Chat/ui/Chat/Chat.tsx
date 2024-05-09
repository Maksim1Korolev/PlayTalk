import { User } from "@/entities/User";
import { onlineApiService } from "@/pages/OnlinePage/api/onlineApiService";
import { cx } from "@/shared/lib/cx";
import { Card, HStack, UiButton, UiText, VStack } from "@/shared/ui";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import SendIcon from "@mui/icons-material/Send";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { Message } from "../ChatMessage/ui/ChatMessage";
import cls from "./Chat.module.scss";

export const Chat = memo(
  ({
    className,
    messageHistory,
    receiverUser,
    handleSendMessage,

    onClose,
    onCollapse,
  }: {
    className?: string;
    messageHistory?: Message[];
    receiverUser: User;
    handleSendMessage: (message: string) => void;
    onClose: () => void;
    onCollapse: () => void;
  }) => {
    const [inputMessage, setInputMessage] = useState<string>("");

    const [cookies] = useCookies(["jwt-cookie"]);

    const { user: currentUser, token } = cookies["jwt-cookie"];

    const dummy = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
      dummy.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, []);

    const handleSendButton = useCallback(() => {
      if (inputMessage.trim() === "") return;
      handleSendMessage(inputMessage);
      setInputMessage("");
      scrollToBottom();
    }, [handleSendMessage, inputMessage, scrollToBottom]);

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

    const setReadAll = useCallback(async () => {
      try {
        await onlineApiService.postAllReadMessages(
          currentUser.username,
          receiverUser.username,
          token
        );
      } catch (error) {
        console.error(error);
      }
    }, [currentUser.username, receiverUser.username, token]);

    useEffect(() => {
      scrollToBottom();
      setReadAll();
    }, [messageHistory?.length, scrollToBottom, setReadAll]);

    const renderMessageHistory = useCallback(() => {
      return messageHistory?.map((message, index) => (
        <ChatMessage
          message={message}
          key={`${index} ${message.date}`}
          isRight={currentUser.username == message.username}
          avatarSrc={
            currentUser.username == message.username
              ? currentUser.avatarPath
              : receiverUser.avatarPath
          }
        />
      ));
    }, [
      messageHistory,
      currentUser.username,
      currentUser.avatarPath,
      receiverUser.avatarPath,
    ]);

    return (
      <VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
        <HStack className={cx(cls.chatBoxHeader, {}, ["drag-handle"])} max>
          <UiText max>{receiverUser.username}</UiText>
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
            <div ref={dummy} />
          </div>
        </Card>
        <div className={cls.chatInput} onKeyDown={handleKeyDown}>
          <ChatInput
            className={cls.chatInputField}
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
