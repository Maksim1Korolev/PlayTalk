import cls from "./ChatMessage.module.scss";

import { Avatar } from "@mui/material";
import { forwardRef } from "react";

import { cx } from "@/shared/lib";
import { Card, UiText } from "@/shared/ui";

import { Message } from "@/entities/Chat";

interface ChatMessageProps {
  className?: string;
  isRight?: boolean;
  message: Message;
  avatarUrl?: string;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ className, isRight, message, avatarUrl }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          cls.chatMsg,
          { [cls.self]: isRight, [cls.user]: !isRight },
          [className]
        )}
      >
        <span className={cls.msgAvatar}>
          <Avatar src={avatarUrl} draggable={false} />
        </span>
        <Card
          padding="16"
          variant={isRight ? "accent" : "light"}
          border="round"
          className={cls.cmMsgText}
        >
          <UiText color={isRight ? "default" : "black"}>
            {message.message}
          </UiText>
        </Card>
      </div>
    );
  }
);
