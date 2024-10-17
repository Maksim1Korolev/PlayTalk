import { useState, useCallback } from "react";

export const useModalPosition = () => {
  const [modalCount, setModalCount] = useState(0);

  const getStartingPosition = useCallback(() => {
    const offset = 30;
    const x = 400 + modalCount * offset;
    const y = 300 + modalCount * offset;

    return { x, y };
  }, [modalCount]);

  const increaseModalCount = useCallback(() => {
    setModalCount(prevCount => prevCount + 1);
  }, []);

  const decreaseModalCount = useCallback(() => {
    setModalCount(prevCount => Math.max(prevCount - 1, 0));
  }, []);

  return { getStartingPosition, increaseModalCount, decreaseModalCount };
};
