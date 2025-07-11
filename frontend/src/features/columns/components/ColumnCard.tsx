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
import { useCards } from "../../cards/hooks/useCards";
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
}: ColumnCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateCardDialog, setShowCreateCardDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [cardCount, setCardCount] = useState(column.cards?.length || 0);

  const { createCard, updateCard } = useCards();
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  // Auto-scroll to bottom when new cards are added
  useEffect(() => {
    const newCardCount = column.cards?.length || 0;
    if (newCardCount > cardCount && cardsContainerRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        cardsContainerRef.current?.scrollTo({
          top: cardsContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
    setCardCount(newCardCount);
  }, [column.cards?.length, cardCount]);

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

  // const handleDeleteCard = async (cardId: string) => {
  //   const success = await deleteCard(cardId);
  //   if (success && onColumnUpdate) {
  //     // Update the local column without the deleted card
  //     const updatedColumn = {
  //       ...column,
  //       cards: (column.cards || []).filter((card) => card.id !== cardId),
  //     };
  //     onColumnUpdate(updatedColumn);
  //   }
  // };

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
              column.cards
                .sort((a, b) => a.order - b.order)
                .map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    onClick={(card) => setEditingCard(card)}
                    isLoading={isLoading}
                  />
                ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No hay tarjetas
              </div>
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
    </>
  );
}
