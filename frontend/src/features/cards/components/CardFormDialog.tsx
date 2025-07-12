"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCardFormDialog } from "../hooks";
import { CardFormDialogProps } from "../types";

export function CardFormDialog({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  card,
  columnId,
  isLoading = false,
}: CardFormDialogProps) {
  const {
    title,
    description,
    errors,
    isEditing,
    setTitle,
    setDescription,
    handleSubmit,
    handleClose,
  } = useCardFormDialog({
    card,
    columnId,
    onSubmit,
    onEdit,
    onClose,
    isLoading,
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
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

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ingresa el título de la tarjeta"
                className={errors.title ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.title && (
                <span className="text-sm text-red-500">{errors.title}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional de la tarjeta"
                rows={3}
                className="min-h-[80px] max-h-[120px] resize-none overflow-y-auto"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
