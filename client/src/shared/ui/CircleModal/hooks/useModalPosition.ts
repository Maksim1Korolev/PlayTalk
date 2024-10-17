import { useContext, useCallback } from "react";
import { ModalContext } from "@/shared/lib/context/ModalContext";

export const useModalPosition = () => {
  const { modalCount } = useContext(ModalContext);

  const getStartingPosition = useCallback(() => {
    const offset = 30;
    const x = 400 + modalCount * offset;
    const y = 300 + modalCount * offset;

    return { x, y };
  }, [modalCount]);

  return { getStartingPosition };
};
