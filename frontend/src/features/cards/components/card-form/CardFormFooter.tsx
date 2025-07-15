import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface CardFormFooterProps {
  isEditing: boolean;
  isLoading: boolean;
  onCancel: () => void;
}

export function CardFormFooter({
  isEditing,
  isLoading,
  onCancel,
}: CardFormFooterProps) {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
      </Button>
    </DialogFooter>
  );
}
