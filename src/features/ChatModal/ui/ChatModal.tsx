import { memo } from "react";
import cls from "./ChatModal.module.scss";
import { Widget } from "react-chat-widget";

export const ChatModal = ({ className }: { className?: string }) => {
  return (
    <div className={`${cls.ChatModal} ${className}`}>
      {/*<Widget
				handleNewUserMessage={handleNewUserMessage}
				profileAvatar={logo}
				title="My new awesome title"
				subtitle="And my cool subtitle"
			
				/>*/}
    </div>
  );
};
