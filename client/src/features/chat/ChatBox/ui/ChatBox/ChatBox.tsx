import cls from "./ChatBox.module.scss";

import { memo, useCallback, useEffect, useRef, useState } from "react";

import { cx, useAppSelector } from "@/shared/lib";
import { Card, UiText, VStack } from "@/shared/ui";
import { BlurredBackground } from "@/shared/ui/Background/ui/BlurredBackground/BlurredBackground";

import { getChatIsTyping, getChatMessages, Message } from "@/entities/Chat";
import { getCurrentUser, getUserAvatarFileName } from "@/entities/User";

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
    const recipientAvatarFileName = useAppSelector(
      getUserAvatarFileName(recipientUsername)
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
          avatarFileName={
            currentUser!.username === message.username
              ? currentUser!.avatarFileName
              : recipientAvatarFileName
          }
        />
      ));
    }, [messageHistory, currentUser, recipientAvatarFileName]);

    return (
      <VStack className={cx(cls.Chat, {}, [className])} justify="start" max>
        <Card
          className={cx(cls.body)}
          padding={"0"}
          variant="outlined"
          border="none"
          max
        >
          <BlurredBackground />
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
