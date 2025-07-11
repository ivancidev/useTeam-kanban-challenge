"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Card } from "../types";

interface CardDisplayProps {
  card: Card;
  className?: string;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  showActions?: boolean;
}

export function CardDisplay({
  card,
  className = "",
  onEdit,
  onDelete,
  showActions = false,
}: CardDisplayProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent card click
    onEdit?.(card);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent card click
    onDelete?.(card.id);
  };

  return (
    <div
      className={`
      relative group p-3 bg-white rounded-lg border border-gray-200 shadow-sm 
      w-full max-w-[272px] overflow-hidden
      min-h-[60px] max-h-[120px]
      box-border flex flex-col
      ${className}
    `}
    >
      {/* Action buttons - show on hover */}
      {showActions && (onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditClick}
              className="h-6 w-6 p-0 bg-white/90 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
              title="Editar tarjeta"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="h-6 w-6 p-0 bg-white/90 hover:bg-red-50 hover:text-red-600 shadow-sm"
              title="Eliminar tarjeta"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate overflow-hidden whitespace-nowrap pr-8">
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
