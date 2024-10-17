import { createContext } from "react";

type ModalContextType = {
  modalCount: number;
  increaseModalCount: () => void;
  decreaseModalCount: () => void;
  resetModalCount: () => void;
};

const defaultModalContext: ModalContextType = {
  modalCount: 0,
  increaseModalCount: () => {},
  decreaseModalCount: () => {},
  resetModalCount: () => {},
};

export const ModalContext =
  createContext<ModalContextType>(defaultModalContext);
