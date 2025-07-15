import { useState } from "react";
import { useInlineCardEdit } from "./useInlineCardEdit";
import { Card, UpdateCardDto } from "../types";

interface UseCardDetailDialogProps {
  card: Card;
  onUpdate: (data: UpdateCardDto) => Promise<void>;
}

export function useCardDetailDialog({
  card,
  onUpdate,
}: UseCardDetailDialogProps) {
  const {
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
    startEditing,
    cancelEditing,
    saveChanges,
    addTag,
    removeTag,
  } = useInlineCardEdit({ card, onUpdate });

  const [newTag, setNewTag] = useState("");

  // Handlers para etiquetas
  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
      setNewTag("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Manejar atajos de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing && e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      saveChanges();
    }
    if (isEditing && e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
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
    startEditing,
    cancelEditing,
    saveChanges,
    newTag,
    setNewTag,
    handleAddTag,
    handleTagKeyDown,
    addTag,
    removeTag,
    handleKeyDown,
  };
}
