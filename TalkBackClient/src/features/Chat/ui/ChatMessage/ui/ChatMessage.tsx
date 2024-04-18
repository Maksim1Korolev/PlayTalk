import { cx } from "@/shared/lib/cx";
import { memo } from "react";

import { Card, UiText, VStack } from "@/shared/ui";
import cls from "./ChatMessage.module.scss";

export interface Message {
  message: string;
  date: Date;
  username: string;
}

export const ChatMessage = memo(
  ({
    className,
    isRight,
    message,
  }: {
    className?: string;
    isRight?: boolean;
    message: Message;
  }) => {
    return (
      //Message Direction
      <VStack
        align={isRight ? "end" : "start"}
        className={cx(cls.messageDirection, {}, [])}
        max
      >
        <Card padding="8" className={cx(cls.ChatMessage, {}, [className])}>
          <UiText>{message.message}</UiText>
        </Card>
      </VStack>
    );
  }
);
