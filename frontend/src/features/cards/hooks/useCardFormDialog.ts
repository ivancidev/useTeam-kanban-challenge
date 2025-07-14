"use client";

import { useState } from "react";
import { useNotifications } from "../../../shared/hooks/useNotifications";
import { isValidCardTitle, sanitizeCardData } from "../helpers";
import {
  FormErrors,
  UseCardFormDialogProps,
  CardPriority,
  CardType,
} from "../types";

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
  const [comments, setComments] = useState(card?.comments || "");
  const [dueDate, setDueDate] = useState(card?.dueDate || "");
  const [priority, setPriority] = useState<CardPriority>(
    card?.priority || CardPriority.MEDIUM
  );
  const [type, setType] = useState<CardType>(card?.type || CardType.TASK);
  const [tags, setTags] = useState<string[]>(card?.tags || []);
  const [errors, setErrors] = useState<FormErrors>({});
  const { notifyError } = useNotifications();

  const isEditing = !!card;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isValidCardTitle(title)) {
      newErrors.title = "El título es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setComments("");
    setDueDate("");
    setPriority(CardPriority.MEDIUM);
    setType(CardType.TASK);
    setTags([]);
    setErrors({});
  };

  const resetToOriginal = () => {
    setTitle(card?.title || "");
    setDescription(card?.description || "");
    setComments(card?.comments || "");
    setDueDate(card?.dueDate || "");
    setPriority(card?.priority || CardPriority.MEDIUM);
    setType(card?.type || CardType.TASK);
    setTags(card?.tags || []);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notifyError("Por favor, corrige los errores en el formulario");
      return;
    }

    try {
      const sanitizedData = sanitizeCardData(
        title,
        description,
        comments,
        tags
      );

      if (isEditing && onEdit) {
        onEdit({
          title: sanitizedData.title,
          description: sanitizedData.description,
          comments: sanitizedData.comments,
          dueDate: dueDate || undefined,
          priority,
          type,
          tags: sanitizedData.tags,
        });
      } else {
        onSubmit({
          title: sanitizedData.title,
          description: sanitizedData.description,
          comments: sanitizedData.comments,
          dueDate: dueDate || undefined,
          priority,
          type,
          tags: sanitizedData.tags,
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
    comments,
    dueDate,
    priority,
    type,
    tags,
    errors,
    isEditing,
    isLoading,
    setTitle: handleTitleChange,
    setDescription,
    setComments,
    setDueDate,
    setPriority,
    setType,
    setTags,
    handleSubmit,
    handleClose,
    validateForm,
    resetForm,
    resetToOriginal,
    hasErrors: Object.keys(errors).length > 0,
    isFormValid: isValidCardTitle(title),
  };
}
