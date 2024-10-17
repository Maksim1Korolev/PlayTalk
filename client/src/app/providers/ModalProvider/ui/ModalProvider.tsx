import { ReactNode, useCallback, useMemo, useState } from "react";

import { ModalContext } from "@/shared/lib/context/ModalContext";

export const ModalProvider = ({ children }: { children?: ReactNode }) => {
  const [modalCount, setModalCount] = useState(0);

  const increaseModalCount = useCallback(() => {
    setModalCount(prevCount => prevCount + 1);
  }, []);

  const decreaseModalCount = useCallback(() => {
    setModalCount(prevCount => Math.max(prevCount - 1, 0));
  }, []);

  const resetModalCount = useCallback(() => {
    setModalCount(0);
  }, []);

  const contextValue = useMemo(
    () => ({
      modalCount,
      increaseModalCount,
      decreaseModalCount,
      resetModalCount,
    }),
    [modalCount, increaseModalCount, decreaseModalCount, resetModalCount]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};
