"use client";

import { Badge } from "@/components/ui/badge";
import { CardPriority } from "../../types";
import { CARD_PRIORITY_OPTIONS } from "../../helpers/cardHelpers";

interface CardPriorityBadgeProps {
  priority: CardPriority;
  size?: "sm" | "md" | "lg";
}

export function CardPriorityBadge({
  priority,
  size = "sm",
}: CardPriorityBadgeProps) {
  const priorityOption = CARD_PRIORITY_OPTIONS.find(
    (option) => option.value === priority
  );

  if (!priorityOption) return null;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 h-5",
    md: "text-sm px-2 py-1 h-6",
    lg: "text-base px-3 py-1.5 h-8",
  };

  return (
    <Badge
      variant="secondary"
      className={`${sizeClasses[size]} flex items-center gap-1 ${priorityOption.color} border-0 font-medium`}
    >
      <span className="text-xs">{priorityOption.icon}</span>
      <span>{priorityOption.label}</span>
    </Badge>
  );
}
