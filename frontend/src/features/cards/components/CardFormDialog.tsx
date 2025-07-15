"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardFormDialog } from "../hooks";
import { CardFormDialogProps } from "../types";
import { useState } from "react";

import {
  CardFormHeader,
  CardFormTitle,
  CardFormTypePriority,
  CardFormDueDate,
  CardFormDescription,
  CardFormComments,
  CardFormTags,
  CardFormFooter,
} from "./card-form";

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
    comments,
    dueDate,
    priority,
    type,
    tags,
    errors,
    isEditing,
    setTitle,
    setDescription,
    setComments,
    setDueDate,
    setPriority,
    setType,
    setTags,
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

  const [newTag, setNewTag] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      addTag(newTag);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <CardFormHeader isEditing={isEditing} />

          <div className="grid gap-4 py-4">
            <CardFormTitle
              title={title}
              setTitle={setTitle}
              error={errors.title}
              isLoading={isLoading}
            />

            <CardFormTypePriority
              type={type}
              priority={priority}
              setType={setType}
              setPriority={setPriority}
            />

            <CardFormDueDate
              dueDate={dueDate}
              setDueDate={setDueDate}
              isLoading={isLoading}
            />

            <CardFormDescription
              description={description}
              setDescription={setDescription}
              isLoading={isLoading}
            />

            <CardFormComments
              comments={comments}
              setComments={setComments}
              isLoading={isLoading}
            />

            <CardFormTags
              tags={tags}
              newTag={newTag}
              setNewTag={setNewTag}
              addTag={addTag}
              removeTag={removeTag}
              handleTagKeyDown={handleTagKeyDown}
              isLoading={isLoading}
            />
          </div>

          <CardFormFooter
            isEditing={isEditing}
            isLoading={isLoading}
            onCancel={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
