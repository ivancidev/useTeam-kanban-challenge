"use client";

import { useState } from "react";
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
import { ColumnFormDialogProps } from "../types";

export function ColumnFormDialog({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  column,
  isLoading = false,
}: ColumnFormDialogProps) {
  const [name, setName] = useState(column?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setIsSubmitting(true);

      if (column && onEdit) {
        // Editing existing column
        await onEdit({ name: name.trim() });
      } else {
        // Creating new column
        await onSubmit({
          name: name.trim(),
        });
      }

      handleClose();
    } catch (error) {
      console.error("Failed to submit column form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName(column?.name || "");
    onClose();
  };

  const isFormValid = name.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {column ? "Editar Columna" : "Nueva Columna"}
          </DialogTitle>
          <DialogDescription>
            {column
              ? "Modifica el nombre de la columna."
              : "Crea una nueva columna para organizar tus tareas."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la columna"
                className="col-span-3"
                maxLength={100}
                disabled={isSubmitting || isLoading}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting || isLoading}
            >
              {isSubmitting ? "Guardando..." : column ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
