import cls from "./ChatBox.module.scss";

import { memo, useCallback, useEffect, useRef, useState } from "react";

import { chatResources } from "@/shared/assets";

import { cx, useAppSelector } from "@/shared/lib";
import { Card, UiText, VStack } from "@/shared/ui";

import { getChatIsTyping, getChatMessages, Message } from "@/entities/Chat";
import { getCurrentUser, getUserAvatarUrl } from "@/entities/User";

import { useChatMessages } from "../../hooks/useChatMessages";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";

export const ChatBox = memo(
  ({
    className,
    recipientUsername,
  }: {
    className?: string;
    recipientUsername: string;
  }) => {
    const dummy = useRef<HTMLDivElement>(null);
    const [inputMessage, setInputMessage] = useState("");

    const currentUser = useAppSelector(getCurrentUser);
    const recipientAvatarUrl = useAppSelector(
      getUserAvatarUrl(recipientUsername)
    );

    const messageHistory = useAppSelector(getChatMessages(recipientUsername));
    const isTyping = useAppSelector(getChatIsTyping(recipientUsername));

    const { sendMessage, notifyTyping, readAllUnreadMessages } =
      useChatMessages({
        recipientUsername,
      });

    useEffect(() => {
      dummy.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      readAllUnreadMessages([currentUser!.username, recipientUsername].sort());
    }, [messageHistory]);

    const renderMessageHistory = useCallback(() => {
      return messageHistory?.map((message: Message, index: number) => (
        <ChatMessage
          key={`${index} ${message.date}`}
          message={message}
          isRight={currentUser!.username === message.username}
          avatarUrl={
            currentUser!.username === message.username
              ? currentUser!.avatarUrl
              : recipientAvatarUrl
          }
        />
      ));
    }, [messageHistory, currentUser, recipientAvatarUrl]);

    return (
      <VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
        <Card
          className={cx(cls.body)}
          variant="blurred"
          border="none"
          padding="0"
          max
        >
          <VStack max>
            <VStack className={cls.chatLogs} gap="16" max>
              {messageHistory && renderMessageHistory()}
              <div ref={dummy} />
            </VStack>
            {isTyping && (
              <UiText dimmed className={cls.typingLabel}>
                {chatResources.label_typing}
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
