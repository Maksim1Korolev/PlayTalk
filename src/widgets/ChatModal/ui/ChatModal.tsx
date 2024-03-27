import { memo } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import { User } from "../../../entities/User";
import { cx } from "../../../shared/lib/cx";
import cls from "./ChatModal.module.scss";
import { useChatSocket } from "../hooks/useChatSocket";

export const ChatModal = memo(
  ({
    className,
    currentUser,
    receiverUser,
  }: {
    className?: string;
    currentUser: User;
    receiverUser: User;
  }) => {
    const printMessage = (message: string) => {
      addResponseMessage(message);
    };

    const handleNewUserMessage = useChatSocket(
      currentUser.username,
      receiverUser.username,
      printMessage
    );

    return (
      <div className={cx(cls.ChatModal, {}, [className])}>
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          //profileAvatar={logo}
          title={receiverUser.username}
        />
      </div>
    );
  }
);
