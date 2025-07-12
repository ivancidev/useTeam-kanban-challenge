"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "../../../shared/hooks/useNotifications";
import { isValidCardTitle, sanitizeCardData, isValidComment } from "../helpers";
import type { Card, UpdateCardDto } from "../types";

interface UseCardDetailModalProps {
  card: Card;
  onSave: (data: UpdateCardDto) => Promise<void>;
}

export function useCardDetailModal({ card, onSave }: UseCardDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotifications();

  // Actualizar el estado local cuando cambie el card prop, pero solo si no estamos editando
  useEffect(() => {
    if (!isEditing) {
      setTitle(card.title);
      setDescription(card.description || "");
    }
  }, [card, isEditing]);

  const handleSave = async () => {
    if (!isValidCardTitle(title)) return;

    setIsLoading(true);
    try {
      const sanitizedData = sanitizeCardData(title, description);
      await onSave(sanitizedData);

      setIsEditing(false);
      notifySuccess("Tarjeta actualizada exitosamente");
    } catch (error) {
      console.error("Error saving card:", error);
      notifyError("Error al guardar la tarjeta");
      setTitle(card.title);
      setDescription(card.description || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description || "");
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!isValidComment(newComment)) return;
    // TODO: Implementar añadir comentario
    setNewComment("");
    notifySuccess("Comentario añadido"); // Placeholder hasta implementar la funcionalidad real
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const clearComment = () => {
    setNewComment("");
  };

  return {
    isEditing,
    title,
    description,
    newComment,
    isLoading,
    setTitle,
    setDescription,
    setNewComment,
    handleSave,
    handleCancel,
    handleAddComment,
    startEditing,
    clearComment,
  };
}
