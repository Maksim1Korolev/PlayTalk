import { memo, useCallback } from "react";
import { User } from "@/entities/User";
import {
  ChatModalStateProps,
  useChatModals,
} from "@/pages/OnlinePage/hooks/useChatModals";
import { ChatModal } from "@/widgets/ChatModal";
import resources from "@/shared/assets/locales/en/OnlinePageResources.json";
import { cx } from "@/shared/lib/cx";
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
        setChatModals((prev) =>
          prev?.filter((modal) => modal.user._id !== userId)
        );
      },
      [setChatModals]
    );

    const renderChatModals = useCallback(() => {
      return chatModals?.map(({ user }, index) => (
        <ChatModal
          className={cx(cls.ChatModals, {}, [className])}
          key={`${user._id} ${index}`}
          currentUsername={currentUser.username}
          receiverUser={user}
          handleSendMessage={handleUserMessage}
          handleCloseModal={handleCloseChatModal}
        />
      ));
    }, [
      chatModals,
      currentUser.username,
      handleCloseChatModal,
      handleUserMessage,
    ]);

    return <>{renderChatModals()}</>;
  }
);