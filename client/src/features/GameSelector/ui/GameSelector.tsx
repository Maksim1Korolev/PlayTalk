import { memo } from "react";
import cls from "./GameSelector.module.scss";
import { cx } from "@/shared/lib/cx";
import { Card, HStack } from "@/shared/ui";

export const GameSelector = ({
  className,
  opponentUsername,
}: {
  className?: string;
  opponentUsername: string;
}) => {
  return (
    <Card className={`${cls.GameSelector} ${className}`}>
      <HStack>
        <div></div>
      </HStack>
    </Card>
  );
};
