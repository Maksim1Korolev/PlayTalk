import { User } from "@/entities/User";
<<<<<<< Updated upstream:client/src/features/Chat/ui/Chat/Chat.tsx
import { communicationApiService } from "@/pages/OnlinePage/api/communicationApiService";
import { cx } from "@/shared/lib/cx";
import { Card, HStack, UiButton, UiText, VStack } from "@/shared/ui";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import SendIcon from "@mui/icons-material/Send";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { useCookies } from "react-cookie";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { Message } from "../ChatMessage/ui/ChatMessage";
=======
import { cx } from "@/shared/lib/cx";
import { Card, UiText, VStack } from "@/shared/ui";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChatInput } from "../../ChatInput";
import { ChatMessage, Message } from "../../ChatMessage";
import { useChatMessages } from "../hooks/useChatMessages";
>>>>>>> Stashed changes:client/src/features/Chat/ui/Chat/ui/ChatBox.tsx
import cls from "./Chat.module.scss";
import { SocketContext } from "@/shared/lib/context/SocketContext";

export const Chat = memo(
  ({
    className,
    currentUser,
    receiverUser,
  }: {
    className?: string;
    currentUser: User;
    receiverUser: User;
  }) => {
    const dummy = useRef<HTMLDivElement>(null);
    const [inputMessage, setInputMessage] = useState("");

    const {
      messageHistory,
      sendMessage,
      isTyping,
      notifyTyping,
      readAllUnreadMessages,
    } = useChatMessages({
      currentUsername: currentUser.username,
      receiverUsername: receiverUser.username,
    });

    useEffect(() => {
<<<<<<< Updated upstream:client/src/features/Chat/ui/Chat/Chat.tsx
      if (isOpen) {
        setReadAll();
        scrollToBottom();
      }
    }, [messageHistory?.length, isOpen]);
=======
      dummy.current?.scrollIntoView({ behavior: "smooth" });
      readAllUnreadMessages(
        [currentUser.username, receiverUser.username].sort()
      );
    }, [messageHistory]);
>>>>>>> Stashed changes:client/src/features/Chat/ui/Chat/ui/ChatBox.tsx

    const renderMessageHistory = useCallback(() => {
      return messageHistory?.map((message: Message, index: number) => (
        <ChatMessage
          message={message}
          key={`${index} ${message.date}`}
          isRight={currentUser.username == message.username}
          avatarSrc={
            currentUser.username == message.username
              ? currentUser.avatarFileName
              : receiverUser.avatarFileName
          }
        />
      ));
    }, [
      messageHistory,
      currentUser.username,
      currentUser.avatarFileName,
      receiverUser.avatarFileName,
    ]);

    return (
      <VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
<<<<<<< Updated upstream:client/src/features/Chat/ui/Chat/Chat.tsx
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
          {isTyping && (
            <UiText dimmed className="">
              Typing...
            </UiText>
          )}
        </Card>
        <div className={cls.chatInput} onKeyDown={handleKeyDown}>
          <ChatInput
            className={cls.chatInputField}
            text={inputMessage}
            placeholder="Type your message here..."
            onChange={handleTyping}
          />

          <UiButton
            className={cls.chatSubmit}
            variant="clear"
            onClick={handleSendButton}
          >
            <SendIcon />
          </UiButton>
        </div>
=======
        <Card className={cx(cls.body)} border="default" variant="light" max>
          <VStack max>
            <div className={cls.chatBoxOverlay}></div>
            <div className={cls.chatLogs}>
              {renderMessageHistory()}
              <div ref={dummy} />
            </div>
            {isTyping && (
              <UiText dimmed className="typingLabel">
                Typing...
              </UiText>
            )}
          </VStack>
        </Card>
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSend={sendMessage}
          onTyping={notifyTyping}
        />
>>>>>>> Stashed changes:client/src/features/Chat/ui/Chat/ui/ChatBox.tsx
      </VStack>
    );
  }
);
