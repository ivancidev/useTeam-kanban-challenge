import { motion } from "framer-motion";
import { CardHeader } from "@/components/ui/card";
import { actionIcons, uiIcons } from "@/shared/helpers/iconHelpers";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";

interface ColumnHeaderProps {
  columnName: string;
  cardCount: number;
  columnColor: {
    header: string;
    light: string;
    medium: string;
    shadow: string;
  };
  isLoading: boolean;
  dragHandleProps: React.HTMLAttributes<HTMLDivElement>;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
}

export function ColumnHeader({
  columnName,
  cardCount,
  columnColor,
  isLoading,
  dragHandleProps,
  onEditColumn,
  onDeleteColumn,
}: ColumnHeaderProps) {
  return (
    <CardHeader
      className={`pb-3 pt-4 px-4 flex-shrink-0 ${columnColor.header} rounded-t-lg !border-0 !border-none !border-t-0 m-0 gap-0`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Drag handle indicator */}
          <div
            {...dragHandleProps}
            className="text-white/70 hover:text-white cursor-move transition-colors p-1 rounded hover:bg-white/10"
            title="Arrastra para reordenar"
          >
            <uiIcons.drag className="h-4 w-4" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-white truncate text-lg">
              {columnName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-white/80 text-sm">
                {cardCount} {cardCount === 1 ? "tarjeta" : "tarjetas"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <motion.button
            onClick={onEditColumn}
            disabled={isLoading}
            className="h-8 w-8 p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            title="Editar columna"
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            <actionIcons.edit className="h-4 w-4" />
          </motion.button>

          <motion.button
            onClick={onDeleteColumn}
            disabled={isLoading}
            className="h-8 w-8 p-1 rounded-md hover:bg-red-500/20 text-white/80 hover:text-red-200 transition-colors disabled:opacity-50 cursor-pointer"
            title="Eliminar columna"
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            <actionIcons.delete className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </CardHeader>
  );
}
