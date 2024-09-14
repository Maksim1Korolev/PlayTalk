import { User } from "@/entities/User";
import { cx } from "@/shared/lib/cx";
import { Card, UiText, VStack } from "@/shared/ui";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChatInput } from "../../ChatInput";
import { ChatMessage, Message } from "../../ChatMessage";
import { useChatMessages } from "../hooks/useChatMessages";
import cls from "./Chat.module.scss";

export const ChatBox = memo(
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
      dummy.current?.scrollIntoView({ behavior: "smooth" });
      readAllUnreadMessages(
        [currentUser.username, receiverUser.username].sort()
      );
    }, [messageHistory]);

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
      </VStack>
    );
  }
);
