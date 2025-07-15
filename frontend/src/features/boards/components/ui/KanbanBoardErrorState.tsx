"use client";

import { motion } from "framer-motion";
import {
  containerAnimations,
  buttonAnimations,
} from "@/shared/helpers/animationHelpers";
import { getButtonClasses } from "@/shared/helpers/colorHelpers";

interface KanbanBoardErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function KanbanBoardErrorState({
  error,
  onRetry,
}: KanbanBoardErrorStateProps) {
  return (
    <motion.div
      className="flex items-center justify-center h-64"
      initial="hidden"
      animate="visible"
      variants={containerAnimations}
    >
      <div className="text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <motion.button
          onClick={onRetry}
          className={getButtonClasses("secondary")}
          variants={buttonAnimations}
          whileHover="hover"
          whileTap="tap"
        >
          Reintentar
        </motion.button>
      </div>
    </motion.div>
  );
}
