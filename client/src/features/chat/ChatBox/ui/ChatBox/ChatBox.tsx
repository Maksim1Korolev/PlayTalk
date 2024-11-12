import cls from "./ChatBox.module.scss";

import { memo, useCallback, useEffect, useRef, useState } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import { Card, UiText, VStack } from "@/shared/ui";

import { getChatIsTyping, Message } from "@/entities/Chat";
import { CurrentUser, User } from "@/entities/User";

import { useChatMessages } from "../../hooks/useChatMessages";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";

export const ChatBox = memo(
  ({
    className,
    currentUser,
    recipient,
  }: {
    className?: string;
    currentUser: CurrentUser;
    recipient: User;
  }) => {
    //TODO:Check for scrolling problem
    const dummy = useRef<HTMLDivElement>(null);
    const [inputMessage, setInputMessage] = useState("");

    const isTyping = useAppSelector(getChatIsTyping(recipient.username));
    console.log(isTyping);

    const { messageHistory, sendMessage, notifyTyping, readAllUnreadMessages } =
      useChatMessages({
        recipientUsername: recipient.username,
      });

    useEffect(() => {
      dummy.current?.scrollIntoView({ behavior: "smooth" });
      readAllUnreadMessages([currentUser!.username, recipient.username].sort());
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
              : recipient.avatarFileName
          }
        />
      ));
    }, [messageHistory, currentUser, recipient.avatarFileName]);

    return (
      <VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
        <Card
          className={cx(cls.body)}
          padding={"0"}
          variant="blurred"
          border="none"
          max
        >
          <VStack max>
            <div className={cls.chatBoxOverlay}></div>
            <VStack className={cls.chatLogs} gap="8" max>
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
