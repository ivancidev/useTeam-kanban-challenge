import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";
import { getButtonClasses } from "@/shared/helpers/colorHelpers";

interface ColumnDeleteDialogProps {
  isOpen: boolean;
  columnName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ColumnDeleteDialog({
  isOpen,
  columnName,
  isDeleting,
  onClose,
  onConfirm,
}: ColumnDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar columna?</DialogTitle>
          <DialogDescription>
            Esta acción eliminará permanentemente la columna &quot;
            {columnName}&quot; y todas sus tarjetas. Esta acción no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <motion.button
            onClick={onClose}
            disabled={isDeleting}
            className={getButtonClasses("secondary")}
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={onConfirm}
            disabled={isDeleting}
            className={getButtonClasses("danger")}
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
