"use client";

import { useState, useEffect } from "react";
import { Card, UpdateCardDto, CardPriority, CardType } from "../types";
import { useNotifications } from "../../../shared/hooks/useNotifications";
import { isValidCardTitle, sanitizeCardData } from "../helpers";

interface UseInlineCardEditProps {
  card: Card;
  onUpdate: (data: UpdateCardDto) => Promise<void>;
}

export function useInlineCardEdit({ card, onUpdate }: UseInlineCardEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de los campos
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [comments, setComments] = useState(card.comments || "");
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [priority, setPriority] = useState<CardPriority>(card.priority);
  const [type, setType] = useState<CardType>(card.type);
  const [tags, setTags] = useState<string[]>(card.tags || []);

  const { notifySuccess, notifyError } = useNotifications();

  // Resetear cuando cambie la tarjeta
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || "");
    setComments(card.comments || "");
    setDueDate(card.dueDate || "");
    setPriority(card.priority);
    setType(card.type);
    setTags(card.tags || []);
  }, [card]);

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    // Resetear a valores originales
    setTitle(card.title);
    setDescription(card.description || "");
    setComments(card.comments || "");
    setDueDate(card.dueDate || "");
    setPriority(card.priority);
    setType(card.type);
    setTags(card.tags || []);
    setIsEditing(false);
  };

  const saveChanges = async () => {
    if (!isValidCardTitle(title)) {
      notifyError("El título es requerido");
      return;
    }

    setIsSaving(true);
    try {
      const sanitizedData = sanitizeCardData(
        title,
        description,
        comments,
        tags
      );

      await onUpdate({
        title: sanitizedData.title,
        description: sanitizedData.description,
        comments: sanitizedData.comments,
        dueDate: dueDate || undefined,
        priority,
        type,
        tags: sanitizedData.tags,
      });

      setIsEditing(false);
      notifySuccess("Tarjeta actualizada");
    } catch (error) {
      console.error("Error saving card:", error);
      notifyError("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return {
    isEditing,
    isSaving,
    title,
    description,
    comments,
    dueDate,
    priority,
    type,
    tags,
    setTitle,
    setDescription,
    setComments,
    setDueDate,
    setPriority,
    setType,
    setTags,
    startEditing,
    cancelEditing,
    saveChanges,
    addTag,
    removeTag,
  };
}
