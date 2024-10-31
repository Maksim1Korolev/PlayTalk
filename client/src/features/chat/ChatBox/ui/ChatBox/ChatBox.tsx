import cls from "./ChatBox.module.scss"

import { memo, useCallback, useEffect, useRef, useState } from "react"

import { cx } from "@/shared/lib"
import { Card, UiText, VStack } from "@/shared/ui"

import { CurrentUser, User } from "@/entities/User"

import { useChatMessages } from "../../hooks/useChatMessages"
import { ChatInput } from "../ChatInput"
import { ChatMessage, Message } from "../ChatMessage"

export const ChatBox = memo(
  ({
    className,
    currentUser,
    receiverUser,
  }: {
    className?: string;
    currentUser: CurrentUser;
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
      currentUsername: currentUser!.username,
      receiverUsername: receiverUser.username,
    });

    useEffect(() => {
      dummy.current?.scrollIntoView({ behavior: "smooth" });
      readAllUnreadMessages(
        [currentUser!.username, receiverUser.username].sort()
      );
    }, [messageHistory]);

    const renderMessageHistory = useCallback(() => {
      return messageHistory?.map((message: Message, index: number) => (
        <ChatMessage
          key={`${index} ${message.date}`}
          message={message}
          isRight={currentUser!.username === message.username}
          avatarFileName={
            currentUser!.username === message.username
              ? currentUser!.avatarFileName
              : receiverUser.avatarFileName
          }
        />
      ));
    }, [messageHistory, currentUser, receiverUser.avatarFileName]);

    return (
      <VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
        <Card className={cx(cls.body)} padding={"0"}variant="blurred" border='none'  max>
          <VStack max>
            <div className={cls.chatBoxOverlay}></div>
            <VStack className={cls.chatLogs} max>
              {messageHistory && renderMessageHistory()}
              <div ref={dummy} />
            </VStack>
						<div className="spacer" />
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
