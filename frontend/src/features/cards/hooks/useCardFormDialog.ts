"use client";

import { useState } from "react";
import { useNotifications } from "../../../shared/hooks/useNotifications";
import {
  isValidCardTitle,
  validateCardForm,
  prepareCardDataForSubmission,
} from "../helpers";
import { FormErrors, UseCardFormDialogProps } from "../types";


export function useCardFormDialog({
  card,
  columnId,
  onSubmit,
  onEdit,
  onClose,
  isLoading = false,
}: UseCardFormDialogProps) {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [errors, setErrors] = useState<FormErrors>({});
  const { notifyError } = useNotifications();

  const isEditing = !!card;

  const validateForm = (): boolean => {
    const newErrors = validateCardForm(title);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setErrors({});
  };

  const resetToOriginal = () => {
    setTitle(card?.title || "");
    setDescription(card?.description || "");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notifyError("Por favor, corrige los errores en el formulario");
      return;
    }

    try {
      const preparedData = prepareCardDataForSubmission(title, description);

      if (isEditing && onEdit) {
        onEdit({
          title: preparedData.title,
          description: preparedData.description,
        });
      } else {
        onSubmit({
          title: preparedData.title,
          description: preparedData.description,
          columnId,
        });
      }

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      notifyError("Error al procesar el formulario");
    }
  };

  const handleClose = () => {
    resetToOriginal();
    onClose();
  };

  const clearTitleError = () => {
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    clearTitleError();
  };

  return {
    title,
    description,
    errors,
    isEditing,
    isLoading,

    setTitle: handleTitleChange,
    setDescription,

    handleSubmit,
    handleClose,
    validateForm,
    resetForm,
    resetToOriginal,

    hasErrors: Object.keys(errors).length > 0,
    isFormValid: isValidCardTitle(title),
  };
}
