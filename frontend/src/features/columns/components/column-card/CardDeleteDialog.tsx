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

import { Card } from "../../../cards/types";

interface CardDeleteDialogProps {
  isOpen: boolean;
  cards: Card[];
  pendingDeleteId: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function CardDeleteDialog({
  isOpen,
  cards,
  pendingDeleteId,
  onClose,
  onConfirm,
}: CardDeleteDialogProps) {
  const cardToDelete = pendingDeleteId
    ? cards?.find((card) => card.id === pendingDeleteId)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar tarjeta?</DialogTitle>
          <DialogDescription>
            {cardToDelete && (
              <>
                Esta acción eliminará permanentemente la tarjeta &quot;
                {cardToDelete.title || "Sin título"}
                &quot;. Esta acción no se puede deshacer.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <motion.button
            onClick={onClose}
            className={getButtonClasses("secondary")}
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className={getButtonClasses("danger")}
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            Eliminar
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
