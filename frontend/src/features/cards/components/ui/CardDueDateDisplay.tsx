"use client";

import { Calendar } from "lucide-react";
import { formatCardDueDate, isCardOverdue } from "../../helpers/cardHelpers";

interface CardDueDateDisplayProps {
  dueDate: string;
  size?: "sm" | "md" | "lg";
}

export function CardDueDateDisplay({
  dueDate,
  size = "sm",
}: CardDueDateDisplayProps) {
  const isOverdue = isCardOverdue(dueDate);
  const formattedDate = formatCardDueDate(dueDate);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-1",
    md: "text-sm px-2 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={`
      inline-flex items-center rounded-md font-medium
      ${sizeClasses[size]}
      ${
        isOverdue
          ? "bg-red-100 text-red-800 border border-red-200"
          : "bg-blue-100 text-blue-800 border border-blue-200"
      }
    `}
    >
      <Calendar className={iconSizes[size]} />
      <span>{formattedDate}</span>
    </div>
  );
}
