"use client";

import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface KanbanScrollNavigationButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
}

export function KanbanScrollNavigationButton({
  direction,
  onClick,
  visible,
}: KanbanScrollNavigationButtonProps) {
  if (!visible) return null;

  const isLeft = direction === "left";
  const Icon = isLeft ? FiChevronLeft : FiChevronRight;

  return (
    <motion.button
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? -20 : 20 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`absolute 
        ${
          isLeft
            ? "left-2 sm:left-4 md:left-6"
            : "right-2 sm:right-4 md:right-6"
        } 
        top-1/2 -translate-y-1/2 z-50 
        bg-gradient-to-r from-blue-500 to-purple-600 
        hover:from-blue-600 hover:to-purple-700 
        text-white rounded-full 
        p-2 sm:p-2
        shadow-lg backdrop-blur-sm border border-white/20 
        transition-all duration-200
        flex items-center justify-center
      `}
      aria-label={isLeft ? "Scroll left" : "Scroll right"}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
    </motion.button>
  );
}
