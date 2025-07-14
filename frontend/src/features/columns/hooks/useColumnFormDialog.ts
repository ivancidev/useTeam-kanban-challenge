"use client";

import { useState } from "react";
import { useNotifications } from "../../../shared/hooks/useNotifications";
import { isValidColumnName, prepareColumnDataForSubmission } from "../helpers";
import { UseColumnFormDialogProps } from "../types";

export function useColumnFormDialog({
  column,
  columns,
  onSubmit,
  onEdit,
  onClose,
  isLoading = false,
}: UseColumnFormDialogProps) {
  const [name, setName] = useState(column?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyError } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidColumnName(name)) return;

    try {
      setIsSubmitting(true);

      const columnData = prepareColumnDataForSubmission(name, columns);

      if (column && onEdit) {
        // Editando columna existente
        await onEdit(columnData);
      } else {
        // Creando nueva columna
        await onSubmit(columnData);
      }

      handleClose();
    } catch (error) {
      console.error("Failed to submit column form:", error);
      notifyError("Error al procesar el formulario de columna");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName(column?.name || "");
    onClose();
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  // Validaciones y estados calculados
  const isFormValid = isValidColumnName(name);
  const isOperationInProgress = isSubmitting || isLoading;
  const isEditing = !!column;

  return {
    name,
    isSubmitting,
    isFormValid,
    isOperationInProgress,
    isEditing,
    handleSubmit,
    handleClose,
    handleNameChange,

    // Textos dinámicos
    dialogTitle: column ? "Editar Columna" : "Nueva Columna",
    dialogDescription: column
      ? "Modifica el nombre de la columna."
      : "Crea una nueva columna para organizar tus tareas.",
    submitButtonText: isSubmitting
      ? "Guardando..."
      : column
      ? "Actualizar"
      : "Crear",
  };
}
