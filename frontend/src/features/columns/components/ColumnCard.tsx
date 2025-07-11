"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDroppable } from "@dnd-kit/core";
import { CardItem } from "../../cards/components/CardItem";
import { CardFormDialog } from "../../cards/components/CardFormDialog";
import { DropIndicator } from "../../cards/components/DropIndicator";
import { useCards } from "../../cards/hooks/useCards";
import { useDeleteConfirmation } from "../../../shared/hooks/useDeleteConfirmation";
import type {
  Card as CardType,
  CreateCardDto,
  UpdateCardDto,
} from "../../cards/types";
import { ColumnCardProps } from "../types";

export function ColumnCard({
  column,
  onEdit,
  onDelete,
  onColumnUpdate,
  isLoading = false,
  shouldShowDropIndicator,
  dragState, 
}: ColumnCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateCardDialog, setShowCreateCardDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [cardCount, setCardCount] = useState(column.cards?.length || 0);
  const [lastCardOperation, setLastCardOperation] = useState<
    "create" | "drag" | null
  >(null);

  const { createCard, updateCard, deleteCard } = useCards();
  const {
    pendingDeleteId,
    isConfirmOpen,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation();
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  // Auto-scroll to bottom when new cards are added (but not during drag operations)
  useEffect(() => {
    const newCardCount = column.cards?.length || 0;

    // Don't auto-scroll if:
    // 1. We're in the middle of a drag operation
    // 2. The last operation was a drag (card moved between columns)
    // 3. The card count decreased (card was removed/moved out)
    const isDragging = dragState?.isDragging || false;
    const cardCountDecreased = newCardCount < cardCount;
    const cardCountIncreased = newCardCount > cardCount;

    // Only auto-scroll for newly created cards, not for drag & drop operations
    const shouldAutoScroll =
      cardCountIncreased &&
      !isDragging &&
      !cardCountDecreased &&
      lastCardOperation === "create";

    if (shouldAutoScroll && cardsContainerRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (cardsContainerRef.current && !dragState?.isDragging) {
          cardsContainerRef.current.scrollTo({
            top: cardsContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 150); // Slightly longer delay for better stability
    }

    setCardCount(newCardCount);

    // Reset the operation type after handling
    if (lastCardOperation) {
      const resetTimer = setTimeout(() => setLastCardOperation(null), 300);
      return () => clearTimeout(resetTimer);
    }
  }, [
    column.cards?.length,
    cardCount,
    dragState?.isDragging,
    lastCardOperation,
  ]);

  // Additional effect to prevent any auto-scroll during drag state changes
  useEffect(() => {
    if (dragState?.isDragging && dragState?.targetColumnId === column.id) {
      // Mark that this column is receiving a dragged card
      setLastCardOperation("drag");
    }
  }, [dragState?.isDragging, dragState?.targetColumnId, column.id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(column.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete column:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCard = async (data: CreateCardDto) => {
    // Mark this as a card creation operation for auto-scroll logic
    setLastCardOperation("create");

    // OPTIMISTIC UPDATE: Create temporary card for immediate UI feedback
    const tempCard: CardType = {
      id: `temp-${Date.now()}`, // Temporary ID
      title: data.title,
      description: data.description || "",
      columnId: column.id,
      order: (column.cards?.length || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update UI immediately
    if (onColumnUpdate) {
      const updatedColumn = {
        ...column,
        cards: [...(column.cards || []), tempCard],
      };
      onColumnUpdate(updatedColumn);
    }

    try {
      const newCard = await createCard(data);
      if (newCard && onColumnUpdate) {
        // Replace temp card with real card from server
        const updatedColumn = {
          ...column,
          cards: [
            ...(column.cards || []).filter((card) => card.id !== tempCard.id),
            newCard,
          ],
        };
        onColumnUpdate(updatedColumn);
      }
      setShowCreateCardDialog(false);
    } catch (error) {
      // Rollback optimistic update on error
      if (onColumnUpdate) {
        const updatedColumn = {
          ...column,
          cards: (column.cards || []).filter((card) => card.id !== tempCard.id),
        };
        onColumnUpdate(updatedColumn);
      }
      console.error("Failed to create card:", error);
      // Don't close dialog on error so user can retry
    }
  };

  const handleEditCard = async (data: UpdateCardDto) => {
    if (!editingCard) return;

    const updatedCard = await updateCard(editingCard.id, data);
    if (updatedCard && onColumnUpdate) {
      // Update the local column with the updated card
      const updatedColumn = {
        ...column,
        cards: (column.cards || []).map((card) =>
          card.id === editingCard.id ? updatedCard : card
        ),
      };
      onColumnUpdate(updatedColumn);
    }
    setEditingCard(null);
  };

  const handleDeleteCard = async (cardId: string) => {
    // OPTIMISTIC UPDATE: Remove card immediately for responsive UX
    if (onColumnUpdate) {
      const updatedColumn = {
        ...column,
        cards: (column.cards || []).filter((card) => card.id !== cardId),
      };
      onColumnUpdate(updatedColumn);
    }

    try {
      const success = await deleteCard(cardId);
      if (!success) {
        // Rollback if delete failed
        // The card is already removed from UI, so we need to add it back
        const originalCard = column.cards?.find((card) => card.id === cardId);
        if (originalCard && onColumnUpdate) {
          const revertedColumn = {
            ...column,
            cards: [...(column.cards || [])].sort((a, b) => a.order - b.order),
          };
          onColumnUpdate(revertedColumn);
        }
      }
    } catch (error) {
      // Rollback on error
      const originalCard = column.cards?.find((card) => card.id === cardId);
      if (originalCard && onColumnUpdate) {
        const revertedColumn = {
          ...column,
          cards: [...(column.cards || [])].sort((a, b) => a.order - b.order),
        };
        onColumnUpdate(revertedColumn);
      }
      console.error("Failed to delete card:", error);
    }
  };

  const handleDeleteRequest = (cardId: string) => {
    requestDelete(cardId);
  };

  const handleConfirmDelete = async () => {
    const cardId = confirmDelete();
    if (cardId) {
      await handleDeleteCard(cardId);
    }
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        className={`w-80 bg-gray-50 border-gray-200 hover:shadow-md transition-shadow flex flex-col h-[calc(100vh-8rem)] max-h-[600px] ${
          isOver ? "bg-blue-50 border-blue-300" : ""
        }`}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {column.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {cardCount} {cardCount === 1 ? "tarjeta" : "tarjetas"}
              </p>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(column)}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-gray-200"
                title="Editar columna"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                title="Eliminar columna"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden">
          <div
            ref={cardsContainerRef}
            className="cards-container flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-2 -mr-2"
          >
            {column.cards && column.cards.length > 0 ? (
              <>
                {/* Drop indicator at the beginning */}
                <DropIndicator
                  isVisible={shouldShowDropIndicator?.(column.id, 0) || false}
                />

                {column.cards
                  .sort((a, b) => a.order - b.order)
                  .map((card, index) => (
                    <div key={card.id}>
                      <CardItem
                        card={card}
                        onEdit={(card) => setEditingCard(card)}
                        onDelete={handleDeleteRequest}
                        isLoading={isLoading}
                      />

                      {/* Drop indicator after each card */}
                      <DropIndicator
                        isVisible={
                          shouldShowDropIndicator?.(column.id, index + 1) ||
                          false
                        }
                      />
                    </div>
                  ))}
              </>
            ) : (
              <>
                {/* Drop indicator for empty column */}
                <DropIndicator
                  isVisible={shouldShowDropIndicator?.(column.id, 0) || false}
                />

                <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                  No hay tarjetas
                </div>
              </>
            )}

            {/* Botón que se mueve junto con las tarjetas inicialmente */}
            <div className="pt-3 sticky bottom-0 bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-gray-600 border-dashed hover:bg-gray-50"
                disabled={isLoading}
                onClick={() => setShowCreateCardDialog(true)}
              >
                + Agregar tarjeta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar columna?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente la columna &quot;
              {column.name}&quot; y todas sus tarjetas. Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Card Dialog */}
      <CardFormDialog
        isOpen={showCreateCardDialog}
        onClose={() => setShowCreateCardDialog(false)}
        onSubmit={handleCreateCard}
        columnId={column.id}
        isLoading={isLoading}
      />

      {/* Edit Card Dialog */}
      {editingCard && (
        <CardFormDialog
          isOpen={true}
          onClose={() => setEditingCard(null)}
          onSubmit={handleCreateCard}
          onEdit={handleEditCard}
          card={editingCard}
          columnId={column.id}
          isLoading={isLoading}
        />
      )}

      {/* Delete Card Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar tarjeta?</DialogTitle>
            <DialogDescription>
              {pendingDeleteId && (
                <>
                  Esta acción eliminará permanentemente la tarjeta &quot;
                  {column.cards?.find((card) => card.id === pendingDeleteId)
                    ?.title || "Sin título"}
                  &quot;. Esta acción no se puede deshacer.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
