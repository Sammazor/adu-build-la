"use client";

import { cn } from "@/lib/utils";

interface CharCountProps {
  current: number;
  min?: number;
  max: number;
  className?: string;
}

export function CharCount({ current, min, max, className }: CharCountProps) {
  const isOver = current > max;
  const isUnder = min !== undefined && current < min && current > 0;
  const isEmpty = current === 0;

  return (
    <span
      className={cn(
        "text-xs tabular-nums",
        isOver
          ? "text-red-500 font-medium"
          : isUnder
          ? "text-amber-500"
          : isEmpty
          ? "text-gray-400"
          : "text-green-600",
        className
      )}
    >
      {current}/{max}
    </span>
  );
}
