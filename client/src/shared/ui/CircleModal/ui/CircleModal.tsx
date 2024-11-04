import { cx } from "@/shared/lib"
import { memo, ReactNode, useState } from "react"
import { Rnd, Props as RndProps } from "react-rnd"
import cls from "./CircleModal.module.scss"

import CancelIcon from "@mui/icons-material/Cancel"
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn"

import { useModalDrag } from "@/shared/lib"
import {
	AddonCircle,
	AddonCircleProps,
	Card,
	HStack,
	UiButton,
	UiText,
	VStack,
} from "@/shared/ui"
import ReactDOM from 'react-dom'

interface CircleModalProps {
  className?: string;
  children?: ReactNode;
  position?: { x: number; y: number };
  addonCircleProps: AddonCircleProps;
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

		const headerHeight = 50; // This should match the CSS fixed height for header
    const [modalHeight, setModalHeight] = useState(420);

    const handleResize = (e: MouseEvent | TouchEvent, dir, ref: HTMLElement) => {
      setModalHeight(ref.offsetHeight); // Update modal height on resize
    };

    const contentHeight = modalHeight - headerHeight;

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

    const rndProps: RndProps = {
      onDragStart: handleDragStart,
      onDragStop: handleDragStop,
			onResize: handleResize,
      default: {
        x: position?.x || 250,
        y: position?.y || 250,
        width: 80,
        height: 80,
      },
      minWidth: isCollapsed ? 80 : 365,
      minHeight: isCollapsed ? 80 : 420,
      maxWidth: isCollapsed ? 80 : 730,
      maxHeight: isCollapsed ? 80 : 840,
      bounds: ".content",
      enableResizing: !isCollapsed,
      dragHandleClassName: isCollapsed ? "" : cls.header,
    };
		
		const modalRoot = document.getElementById("root");
    if (!modalRoot) {
      console.error("Modal root element not found!");
      return null;
    }

    const modalContent = (
      <Rnd {...rndProps} style={{ zIndex: 100 }}>
        {isCollapsed ? (
          <AddonCircle {...addonCircleProps} onClick={handleOpenCircleModal} />
        ) : (
					<VStack className={cx(cls.CircleModal, {}, [className])}>
            <HStack className={cx(cls.header, {}, ["drag-handle"])} max>
              <UiText className={cls.headerString} bold max>
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
						<Card style={{ height: `${contentHeight}px` }} className={cls.contentCard} max padding={"0"} variant='matte' border='default'>
            {children}
					</Card>
          </VStack>							
        )}
      </Rnd>
    );

		return ReactDOM.createPortal(modalContent, modalRoot)
  }
);
