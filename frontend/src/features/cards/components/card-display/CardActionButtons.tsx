import { motion } from "framer-motion";
import { actionIcons } from "@/shared/helpers/iconHelpers";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";
import { Card } from "../../types";

interface CardActionButtonsProps {
  card: Card;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}

export function CardActionButtons({
  card,
  onEdit,
  onDelete,
}: CardActionButtonsProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(card);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(card.id);
  };

  if (!onEdit && !onDelete) return null;

  return (
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
  );
}
