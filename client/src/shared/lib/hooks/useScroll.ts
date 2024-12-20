import { useEffect } from "react";

type StartPosition = "start" | "end";

interface UseScrollProps {
  scrollEndRef: React.RefObject<HTMLDivElement>;
  startPosition?: StartPosition;
}

//May be used for advanced scroll afterwards
/**
 * Reusable hook for Modal Components (drawer/modal)
 * @param
 */
export function useScroll({
  scrollEndRef,
  startPosition = "start",
}: UseScrollProps) {
  useEffect(() => {
    if (!scrollEndRef.current) return;

    scrollEndRef.current.scrollTop =
      startPosition === "start"
        ? 0
        : scrollEndRef.current.scrollHeight - scrollEndRef.current.clientHeight;
  }, [scrollEndRef, startPosition]);

  const scrollTo = (scrollTop: number) => {
    if (!scrollEndRef.current) return;
    scrollEndRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
  };

  return {
    scrollTo,
  };
}
