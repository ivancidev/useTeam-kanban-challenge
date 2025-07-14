"use client";

import { motion } from "framer-motion";
import { CardDisplayProps } from "../types";
import { actionIcons, uiIcons } from "@/shared/helpers/iconHelpers";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";
import { getCardColor } from "@/shared/helpers/colorHelpers";

export function CardDisplay({
  card,
  className = "",
  onEdit,
  onDelete,
}: CardDisplayProps) {
  const cardColor = getCardColor(card.id);

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
      relative group p-3 ${cardColor.background}
      rounded-xl border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl ${cardColor.shadow}
      w-full max-w-none overflow-visible
      h-[75px]
      box-border flex flex-col
      transition-all duration-200 ease-out
      hover:-translate-y-0.5
      backdrop-blur-sm
      ring-2 ring-gray-200 hover:ring-gray-300 ${cardColor.border}
      isolate
      bg-gradient-to-br from-white/98 to-white/95
      outline-1 outline-gray-200/50
      ${className}
    `}
    >
      {/* Badge de comentario - mejor posicionado para ser visible */}
      {card.description && card.description.trim().length > 0 && (
        <div className="absolute bottom-2 left-2 z-20">
          <div className="bg-blue-500 text-white rounded-full p-1.5 shadow-lg border-2 border-gray-300 ring-1 ring-blue-400">
            <uiIcons.comment className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Action buttons modernos - mejor posicionamiento sin chocar */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <motion.button
              onClick={handleEditClick}
              className="h-6 w-6 p-1 bg-white/98 hover:bg-blue-50 hover:text-blue-600 
                         rounded-md shadow-sm border border-gray-300 hover:border-blue-300 transition-all duration-200
                         hover:shadow-md backdrop-blur-sm ring-1 ring-gray-200"
              title="Editar tarjeta"
              variants={buttonAnimations}
              whileHover="hover"
              whileTap="tap"
            >
              <actionIcons.edit className="h-3 w-3" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={handleDeleteClick}
              className="h-6 w-6 p-1 bg-white/98 hover:bg-red-50 hover:text-red-600 
                         rounded-md shadow-sm border border-gray-300 hover:border-red-300 transition-all duration-200
                         hover:shadow-md backdrop-blur-sm ring-1 ring-gray-200"
              title="Eliminar tarjeta"
              variants={buttonAnimations}
              whileHover="hover"
              whileTap="tap"
            >
              <actionIcons.delete className="h-3 w-3" />
            </motion.button>
          )}
        </div>
      )}

      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2 truncate overflow-hidden whitespace-nowrap pr-4 pl-1 relative z-[1] drop-shadow-sm">
        {card.title}
      </h4>
    </div>
  );
}
