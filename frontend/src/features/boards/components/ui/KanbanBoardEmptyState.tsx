"use client";

import { motion } from "framer-motion";
import { actionIcons } from "@/shared/helpers/iconHelpers";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";
import { getButtonClasses } from "@/shared/helpers/colorHelpers";

interface KanbanBoardEmptyStateProps {
  onCreateColumn: () => void;
  isLoading: boolean;
}

export function KanbanBoardEmptyState({
  onCreateColumn,
  isLoading,
}: KanbanBoardEmptyStateProps) {
  return (
    <motion.div
      className="flex items-center justify-center w-full h-96"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <actionIcons.add className="h-10 w-10 text-blue-500" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Sin columnas aún
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          Comienza creando tu primera columna para organizar las tareas de tu
          proyecto
        </p>
        <motion.button
          onClick={onCreateColumn}
          disabled={isLoading}
          className={getButtonClasses("primary")}
          variants={buttonAnimations}
          whileHover="hover"
          whileTap="tap"
        >
          Crear primera columna
        </motion.button>
      </div>
    </motion.div>
  );
}
