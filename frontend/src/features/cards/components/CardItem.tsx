"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cardAnimations } from "@/shared/helpers/animationHelpers";
import { CardDisplay } from "./CardDisplay";
import { CardItemProps } from "../types";

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
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      variants={cardAnimations}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileTap="tap"
      layout
      className="isolate"
    >
      <CardDisplay
        card={card}
        onEdit={onEdit}
        onDelete={onDelete}
        className={`
          transition-all duration-200
          ${onClick ? "cursor-pointer" : "cursor-default"}
          ${isLoading ? "opacity-50" : ""}
          ${isDragging ? "opacity-30 scale-95" : ""}
        `}
      />
    </motion.div>
  );
}
