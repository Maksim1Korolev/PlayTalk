import { getModalCount } from '@/entities/Modal/model'
import { useAppSelector } from '@/shared/lib'
import { useCallback } from "react"

export const useModalPosition = () => {
  const modalCount = useAppSelector(getModalCount)

  const getStartingPosition = useCallback(() => {
    const offset = 30;
    const x = 400 + modalCount * offset;
    const y = 300 + modalCount * offset;

    return { x, y };
  }, [modalCount]);

  return { getStartingPosition };
};
