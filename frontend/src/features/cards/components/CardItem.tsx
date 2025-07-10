"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CardItemProps } from "../types";

export function CardItem({ card, onClick, isLoading = false }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
  });

  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: card.id,
  });

  // Combine both refs
  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleClick = () => {
    if (onClick && !isLoading && !isDragging) {
      onClick(card);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 bg-white rounded-lg border border-gray-200 shadow-sm 
        hover:shadow-md transition-shadow 
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${isLoading ? "opacity-50" : ""}
        ${isDragging ? "opacity-30 scale-95" : ""}
        ${isOver ? "border-blue-300 bg-blue-50" : ""}
      `}
      onClick={handleClick}
    >
      <h4 className="font-medium text-gray-900 text-sm mb-1">{card.title}</h4>
      {card.description && (
        <p className="text-xs text-gray-600 line-clamp-2">{card.description}</p>
      )}
    </div>
  );
}
