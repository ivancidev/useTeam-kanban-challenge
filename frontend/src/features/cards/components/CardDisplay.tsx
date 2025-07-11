"use client";

import type { Card } from "../types";

interface CardDisplayProps {
  card: Card;
  className?: string;
}

export function CardDisplay({ card, className = "" }: CardDisplayProps) {
  return (
    <div
      className={`
      p-3 bg-white rounded-lg border border-gray-200 shadow-sm 
      w-full max-w-[272px] overflow-hidden
      min-h-[60px] max-h-[120px]
      box-border flex flex-col
      ${className}
    `}
    >
      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate overflow-hidden whitespace-nowrap">
        {card.title}
      </h4>
      {card.description && (
        <div
          className="text-xs text-gray-600 overflow-hidden break-words leading-relaxed flex-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
            maxHeight: "3.6rem", // Aproximadamente 3 líneas
          }}
        >
          {card.description}
        </div>
      )}
    </div>
  );
}
