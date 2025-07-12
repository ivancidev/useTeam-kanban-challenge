"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
        `}
      />
    </div>
  );
}
