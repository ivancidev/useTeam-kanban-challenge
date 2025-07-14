"use client";

import { Badge } from "@/components/ui/badge";

interface CardTagsDisplayProps {
  tags: string[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
}

export function CardTagsDisplay({
  tags,
  maxVisible = 3,
  size = "sm",
}: CardTagsDisplayProps) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = Math.max(0, tags.length - maxVisible);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 h-5",
    md: "text-sm px-2 py-1 h-6",
    lg: "text-base px-3 py-1.5 h-8",
  };

  return (
    <div className="flex flex-wrap gap-1">
      {visibleTags.map((tag, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`${sizeClasses[size]} bg-gray-50 text-gray-700 border-gray-300 font-medium`}
        >
          {tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          variant="secondary"
          className={`${sizeClasses[size]} bg-gray-200 text-gray-600 font-medium`}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
