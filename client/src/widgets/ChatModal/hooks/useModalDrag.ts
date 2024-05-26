import { useCallback, useState } from "react"; // Import the type from react
import { DraggableData, DraggableEvent } from "react-draggable"; // Import the type from react-draggable

interface Position {
  x: number;
  y: number;
}

export const useModalDrag = (initialPosition: Position = { x: 0, y: 0 }) => {
  const [startPos, setStartPos] = useState<Position>(initialPosition);
  const [isDragged, setIsDragged] = useState<boolean>(false);

  const handleDragStart = useCallback(
    (event: DraggableEvent, data: DraggableData) => {
      setStartPos({ x: data.x, y: data.y });
      setIsDragged(false);
    },
    []
  );

  const handleDragStop = useCallback(
    (event: DraggableEvent, data: DraggableData) => {
      const distance = Math.sqrt(
        Math.pow(data.x - startPos.x, 2) + Math.pow(data.y - startPos.y, 2)
      );
      if (distance > 10) {
        setIsDragged(true);
      }
    },
    [startPos]
  );

  return { isDragged, handleDragStart, handleDragStop };
};
