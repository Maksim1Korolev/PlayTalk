import { memo } from "react";
import cls from "./ChatModal.module.scss";
import { Widget } from "react-chat-widget";
import { User } from "../../../entities/User";
import { cx } from "../../../shared/lib/cx";

export const ChatModal = memo(
  ({
    className,
    handleUserMessage,
    user,
  }: {
    className?: string;
    handleUserMessage: (newMessage: string) => void;
    user: User;
  }) => {
    return (
      <div className={cx(cls.ChatModal, {}, [className])}>
        <Widget
          handleNewUserMessage={handleUserMessage}
          //profileAvatar={logo}
          title={user.username}
        />
      </div>
    );
  }
);
