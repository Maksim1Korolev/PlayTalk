import { User } from "@/entities/User";

export interface ChatModalStateProps {
  user: User;
  position: { x: number; y: number };
}

export const useModalPosition = () => {
  const findNewModalPosition = (modals: ChatModalStateProps[]) => {
    let x = 400;
    let y = 300;
    const offset = 30;

    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      if (x === modal.position?.x && y === modal.position.y) {
        x -= offset;
        y -= offset;

        if (x < 0 || y < 0) {
          x = window.innerWidth - 400;
          y = window.innerHeight - 300;
        }
      }
    }

    return { x, y };
  };

  return {};
};
