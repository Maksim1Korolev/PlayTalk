import { ReactNode, useEffect, useState } from "react";
import cls from "./CircleModal.module.scss";
import { cx } from "@/shared/lib/cx";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import CancelIcon from "@mui/icons-material/Cancel";
import { useModalDrag } from "../hooks/useModalDrag";
import { Rnd } from "react-rnd";
import { HStack, VStack, UiButton, UiText } from "@/shared/ui";

interface CircleModalProps {
  className?: string;
  children?: ReactNode;
  position?: { x: number; y: number };
  headerString?: string;
  onClose: () => void;
}

export const CircleModal = ({
  className,
  children,
  position,
  headerString,
  onClose,
}: CircleModalProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDragged, handleDragStart, handleDragStop } = useModalDrag();

  const handleOpenCircleModal = () => {
    if (!isDragged) {
      setIsCollapsed(false);
    }
  };

  const handleCollapseCircleModal = () => {
    if (!isDragged) {
      setIsCollapsed(true);
    }
  };

  return (
    <Rnd
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      default={{
        x: position?.x || 0,
        y: position?.y || 0,
        width: 80,
        height: 80,
      }}
      minWidth={isCollapsed ? 80 : 365}
      minHeight={isCollapsed ? 80 : 400}
      bounds="window"
      enableResizing={!isCollapsed}
    >
      {isCollapsed ? (
        <UiButton onClick={handleOpenCircleModal}>Circle</UiButton>
      ) : (
        <VStack className={cx(cls.CircleModal, {}, [className])}>
          <HStack className={cx(cls.header, {}, ["drag-handle"])} max>
            <UiText max>{headerString}</UiText>
            <HStack className={cls.controlButtons}>
              <UiButton
                variant="clear"
                onClick={handleCollapseCircleModal}
                className={cls.collapseButton}
              >
                <DoDisturbOnIcon />
              </UiButton>
              <UiButton
                variant="clear"
                onClick={onClose}
                className={cls.closeButton}
              >
                <CancelIcon />
              </UiButton>
            </HStack>
          </HStack>
          {children}
        </VStack>
      )}
    </Rnd>
  );
};
