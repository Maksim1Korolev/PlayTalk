import { cx } from "@/shared/lib/cx";
import { forwardRef } from "react";

import { AppImage } from "@/shared/ui/AppImage";
import { getAvatarPath } from "@/shared/ui/AppImage/ui/AppImage";
import cls from "./ChatMessage.module.scss";

export interface Message {
  _id?: string;
  message: string;
  date: Date;
  username: string;
  readAt?: Date;
}

interface ChatMessageProps {
  className?: string;
  isRight?: boolean;
  message: Message;
  avatarSrc?: string;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ className, isRight, message, avatarSrc }, ref) => {
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
          {avatarSrc && <AppImage src={getAvatarPath(avatarSrc)} />}
        </span>
        <div className={cls.cmMsgText}>{message.message}</div>
      </div>
    );
  }
);
