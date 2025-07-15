import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CardFormHeaderProps {
  isEditing: boolean;
}

export function CardFormHeader({ isEditing }: CardFormHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditing ? "Editar tarjeta" : "Crear nueva tarjeta"}
      </DialogTitle>
      <DialogDescription>
        {isEditing
          ? "Modifica los detalles de la tarjeta."
          : "Agrega una nueva tarjeta a la columna."}
      </DialogDescription>
    </DialogHeader>
  );
}
