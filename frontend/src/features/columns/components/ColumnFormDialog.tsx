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
import { useColumnFormDialog } from "../hooks";
import { ColumnFormDialogProps } from "../types";

export function ColumnFormDialog({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  column,
  isLoading = false,
}: ColumnFormDialogProps) {
  // Usar el hook personalizado para manejar toda la lógica del formulario
  const {
    name,
    isFormValid,
    isOperationInProgress,
    handleSubmit,
    handleClose,
    handleNameChange,
    dialogTitle,
    dialogDescription,
    submitButtonText,
  } = useColumnFormDialog({
    column,
    onSubmit,
    onEdit,
    onClose,
    isLoading,
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nombre de la columna"
                className="col-span-3"
                maxLength={100}
                disabled={isOperationInProgress}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isOperationInProgress}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isOperationInProgress}
            >
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
