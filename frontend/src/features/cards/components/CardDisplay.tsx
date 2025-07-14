"use client";

import { motion } from "framer-motion";
import { CardDisplayProps } from "../types";
import { actionIcons, uiIcons } from "@/shared/helpers/iconHelpers";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";
import { getCardColor } from "@/shared/helpers/colorHelpers";
import { useCardDisplayLogic } from "../hooks";
import {
  CardPriorityBadge,
  CardTypeBadge,
  CardDueDateDisplay,
  CardTagsDisplay,
} from "./ui";

export function CardDisplay({
  card,
  className = "",
  onEdit,
  onDelete,
}: CardDisplayProps) {
  const cardColor = getCardColor(card.id);
  const cardInfo = useCardDisplayLogic(card);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(card);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(card.id);
  };

  return (
    <div
      className={`
      relative group p-3 ${cardColor.background}
      rounded-xl border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl ${cardColor.shadow}
      w-full max-w-none overflow-visible
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
      style={{ minHeight: `${cardInfo.estimatedHeight}px` }}
    >
      {/* Action buttons */}
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

      {/* Título */}
      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2 truncate pr-16">
        {card.title}
      </h4>

      {/* Badges: Tipo y Prioridad */}
      <div className="flex gap-1 mb-2">
        {cardInfo.showType && <CardTypeBadge type={card.type} size="sm" />}
        {cardInfo.showPriority && (
          <CardPriorityBadge priority={card.priority} size="sm" />
        )}
      </div>

      {/* Fecha límite */}
      {cardInfo.hasDueDate && (
        <div className="mb-2">
          <CardDueDateDisplay dueDate={card.dueDate!} size="sm" />
        </div>
      )}

      {/* Etiquetas */}
      {cardInfo.hasTags && (
        <div className="mb-2">
          <CardTagsDisplay tags={card.tags} maxVisible={2} size="sm" />
        </div>
      )}

      {/* Indicadores de contenido adicional */}
      <div className="flex items-center gap-2 mt-auto">
        {cardInfo.hasDescription && (
          <div className="bg-blue-500 text-white rounded-full p-1 shadow-sm">
            <uiIcons.comment className="h-3 w-3" />
          </div>
        )}
        {cardInfo.hasComments && (
          <div className="bg-purple-500 text-white rounded-full p-1 shadow-sm">
            <uiIcons.message className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
}
