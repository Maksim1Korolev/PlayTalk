import { User } from "@/entities/User";
import {
  ChatModalStateProps,
  useChatModals,
} from "@/pages/OnlinePage/hooks/useChatModals";
import { cx } from "@/shared/lib/cx";
import { ChatModal } from "@/widgets/ChatModal";
import { memo, useCallback } from "react";
import cls from "./ChatModals.module.scss";

export const ChatModals = memo(
  ({
    className,
    currentUser,
    chatModals,
    setChatModals,
  }: {
    className?: string;
    currentUser: User;
    chatModals: ChatModalStateProps[] | undefined;
    setChatModals: React.Dispatch<
      React.SetStateAction<ChatModalStateProps[] | undefined>
    >;
  }) => {
    const { handleUserMessage } = useChatModals(currentUser);

    const handleCloseChatModal = useCallback(
      (userId: string) => {
        setChatModals(prev => prev?.filter(modal => modal.user._id !== userId));
      },
      [setChatModals]
    );

    const renderChatModals = useCallback(() => {
      return chatModals?.map(({ user, position }) => (
        <ChatModal
          className={cx(cls.ChatModals, {}, [className])}
          key={`${user._id}`}
          currentUsername={currentUser.username}
          receiverUser={user}
          handleSendMessage={handleUserMessage}
          handleCloseModal={handleCloseChatModal}
          position={position}
        />
      ));
    }, [
      chatModals,
      className,
      currentUser.username,
      handleCloseChatModal,
      handleUserMessage,
    ]);

    return <>{renderChatModals()}</>;
  }
);
