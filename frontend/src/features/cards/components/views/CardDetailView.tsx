"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Card, UpdateCardDto } from "../../types";
import { useCardDetailDialog } from "../../hooks/useCardDetailDialog";

import {
  CardDetailHeader,
  CardTypePriority,
  CardDueDate,
  CardTags,
  CardDescription,
  CardComments,
  CardDateInfo,
  CardDetailFooter,
} from "../card-detail";

interface CardDetailViewInlineProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  columnName?: string;
  onUpdate: (data: UpdateCardDto) => Promise<void>;
}

export function CardDetailView({
  isOpen,
  onClose,
  card,
  columnName = "Sin columna",
  onUpdate,
}: CardDetailViewInlineProps) {
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
    newTag,
    setNewTag,
    handleAddTag,
    handleTagKeyDown,
    addTag,
    removeTag,
    handleKeyDown,
  } = useCardDetailDialog({ card, onUpdate });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-none h-[85vh] overflow-hidden p-0 border-2 border-gray-300 shadow-xl"
        style={{ width: "min(1200px, 90vw)", maxWidth: "none" }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col h-full">
          <CardDetailHeader
            card={card}
            columnName={columnName}
            isEditing={isEditing}
            isSaving={isSaving}
            title={title}
            setTitle={setTitle}
            startEditing={startEditing}
          />

          <div
            className="flex-1 overflow-y-auto px-6 py-4"
            style={{ maxHeight: "calc(85vh - 140px)" }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Columna izquierda */}
              <div className="space-y-6">
                <CardTypePriority
                  card={card}
                  isEditing={isEditing}
                  type={type}
                  priority={priority}
                  setType={setType}
                  setPriority={setPriority}
                />

                <CardDueDate
                  isEditing={isEditing}
                  isSaving={isSaving}
                  dueDate={dueDate}
                  setDueDate={setDueDate}
                  startEditing={startEditing}
                />

                <CardTags
                  isEditing={isEditing}
                  isSaving={isSaving}
                  tags={tags}
                  newTag={newTag}
                  setNewTag={setNewTag}
                  handleAddTag={handleAddTag}
                  handleTagKeyDown={handleTagKeyDown}
                  addTag={addTag}
                  removeTag={removeTag}
                  startEditing={startEditing}
                />
              </div>

              {/* Columna derecha */}
              <div className="space-y-6">
                <CardDescription
                  isEditing={isEditing}
                  isSaving={isSaving}
                  description={description}
                  setDescription={setDescription}
                  startEditing={startEditing}
                />

                <CardComments
                  isEditing={isEditing}
                  isSaving={isSaving}
                  comments={comments}
                  setComments={setComments}
                  startEditing={startEditing}
                />
              </div>
            </div>

            <CardDateInfo card={card} />
          </div>

          <CardDetailFooter
            isEditing={isEditing}
            isSaving={isSaving}
            cancelEditing={cancelEditing}
            saveChanges={saveChanges}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
