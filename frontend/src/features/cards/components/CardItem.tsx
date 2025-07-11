"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CardItemProps } from "../types";
import { CardDisplay } from "./CardDisplay";

export function CardItem({
  card,
  onClick,
  onEdit,
  onDelete,
  isLoading = false,
}: CardItemProps) {
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
      onClick={handleClick}
    >
      <CardDisplay
        card={card}
        onEdit={onEdit}
        onDelete={onDelete}
        showActions={!isDragging && (!!onEdit || !!onDelete)}
        className={`
          hover:shadow-md transition-shadow 
          ${onClick ? "cursor-pointer" : "cursor-default"}
          ${isLoading ? "opacity-50" : ""}
          ${isDragging ? "opacity-30 scale-95" : ""}
          ${isOver ? "border-blue-300 bg-blue-50" : ""}
        `}
      />
    </div>
  );
}
