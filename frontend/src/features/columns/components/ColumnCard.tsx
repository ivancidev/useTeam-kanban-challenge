"use client";

import { useState } from "react";
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

  const { createCard, updateCard, deleteCard } = useCards();

  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

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
    const newCard = await createCard(data);
    if (newCard && onColumnUpdate) {
      // Update the local column with the new card
      const updatedColumn = {
        ...column,
        cards: [...(column.cards || []), newCard],
      };
      onColumnUpdate(updatedColumn);
    }
    setShowCreateCardDialog(false);
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
    const success = await deleteCard(cardId);
    if (success && onColumnUpdate) {
      // Update the local column without the deleted card
      const updatedColumn = {
        ...column,
        cards: (column.cards || []).filter((card) => card.id !== cardId),
      };
      onColumnUpdate(updatedColumn);
    }
  };

  const cardCount = column.cards?.length || 0;

  return (
    <>
      <Card
        ref={setNodeRef}
        className={`w-80 bg-gray-50 border-gray-200 hover:shadow-md transition-shadow ${
          isOver ? "bg-blue-50 border-blue-300" : ""
        }`}
      >
        <CardHeader className="pb-3">
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

        <CardContent className="pt-0">
          <div className="min-h-[200px] space-y-2">
            {column.cards && column.cards.length > 0 ? (
              column.cards.map((card) => (
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
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-gray-600 border-dashed hover:bg-gray-50"
            disabled={isLoading}
            onClick={() => setShowCreateCardDialog(true)}
          >
            + Agregar tarjeta
          </Button>
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
