import { cx } from "@/shared/lib"
import { forwardRef } from "react"
import cls from "./ChatMessage.module.scss"

import { AppImage } from "@/shared/ui"
import getImagePath from "@/shared/utils/getImagePath"

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
  avatarFileName?: string;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ className, isRight, message, avatarFileName }, ref) => {
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
          
            <AppImage
              src={getImagePath({
                collection: "avatars",
                fileName: avatarFileName,
              })}
              draggable={false}
            />
          
        </span>
        <div className={cls.cmMsgText}>{message.message}</div>
      </div>
    );
  }
);