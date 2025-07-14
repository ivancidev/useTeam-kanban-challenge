"use client";

import { Badge } from "@/components/ui/badge";
import { CardType } from "../../types";
import { CARD_TYPE_OPTIONS } from "../../helpers/cardHelpers";

interface CardTypeBadgeProps {
  type: CardType;
  size?: "sm" | "md" | "lg";
}

export function CardTypeBadge({ type, size = "sm" }: CardTypeBadgeProps) {
  const typeOption = CARD_TYPE_OPTIONS.find((option) => option.value === type);

  if (!typeOption) return null;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 h-5",
    md: "text-sm px-2 py-1 h-6",
    lg: "text-base px-3 py-1.5 h-8",
  };

  return (
    <Badge
      variant="outline"
      className={`${sizeClasses[size]} flex items-center gap-1 ${typeOption.color} font-medium`}
    >
      <span className="text-xs">{typeOption.icon}</span>
      <span>{typeOption.label}</span>
    </Badge>
  );
}
