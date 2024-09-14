import { useModalDrag } from "@/shared/hooks/useModalDrag";
import { cx } from "@/shared/lib/cx";
import {
  AddonCircle,
  AddonCircleProps,
  HStack,
  UiButton,
  UiText,
  VStack,
} from "@/shared/ui";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import { memo, ReactNode, useState } from "react";
import { Rnd } from "react-rnd";
import { Skeleton } from "../../Skeleton";
import cls from "./CircleModal.module.scss";

interface CircleModalProps {
  className?: string;
  children?: ReactNode;
  position?: { x: number; y: number };
  addonCircleProps?: AddonCircleProps;
  headerString?: string;
  onClose: () => void;
}

export const CircleModal = memo(
  ({
    className,
    children,
    position,
    headerString,
    addonCircleProps,
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

    const rndProps = {
      onDragStart: handleDragStart,
      onDragStop: handleDragStop,
      default: {
        x: position?.x || 0,
        y: position?.y || 0,
        width: 80,
        height: 80,
      },
      minWidth: isCollapsed ? 80 : 365,
      minHeight: isCollapsed ? 80 : 475,
      bounds: "window",
      enableResizing: !isCollapsed,
    };

    return (
      <Rnd {...rndProps}>
        {isCollapsed ? (
          addonCircleProps ? (
            <AddonCircle
              {...addonCircleProps}
              onClick={handleOpenCircleModal}
            />
          ) : (
            <Skeleton width={80} height={80} border="50%" />
          )
        ) : (
          <VStack className={cx(cls.CircleModal, {}, [className])}>
            <HStack className={cx(cls.header, {}, ["drag-handle"])} max>
              <UiText className={cls.headerString} max>
                {headerString}
              </UiText>
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
  }
);
