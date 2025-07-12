"use client";

import { Edit, Trash2, GripVertical } from "lucide-react";
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
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CardItem } from "../../cards/components/CardItem";
import { CardFormDialog } from "../../cards/components/CardFormDialog";
import { CardDetailModal } from "../../cards/components/CardDetailModal";
import { DropIndicator } from "../../cards/components/DropIndicator";
import { useColumnCard } from "../hooks";
import { ColumnCardProps } from "../types";

export function ColumnCard({
  column,
  index,
  onEdit,
  onDelete,
  onColumnUpdate,
  isLoading = false,
  shouldShowDropIndicator,
  dragState,
}: ColumnCardProps) {
  const {
    showDeleteDialog,
    isDeleting,
    showCreateCardDialog,
    editingCard,
    cardCount,
    isOver,
    isDragging,
    pendingDeleteId,
    isConfirmOpen,
    setNodeRef,
    setCardsContainerRef,
    dragHandleProps,
    dragStyle,
    handleDelete,
    handleCreateCard,
    handleEditCard,
    handleDeleteRequest,
    handleConfirmDelete,
    handleEditColumn,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenCreateCardDialog,
    handleCloseCreateCardDialog,
    handleOpenEditCard,
    handleCloseEditCard,
    cancelDelete,
  } = useColumnCard({
    column,
    index,
    onEdit,
    onDelete,
    onColumnUpdate,
    isLoading,
    shouldShowDropIndicator,
    dragState,
  });

  return (
    <>
      <Card
        ref={setNodeRef}
        style={dragStyle}
        className={`w-80 bg-gray-50 border-gray-200 hover:shadow-md transition-shadow flex flex-col h-[calc(100vh-8rem)] max-h-[600px] ${
          isOver ? "bg-blue-50 border-blue-300" : ""
        } ${isDragging ? "opacity-50" : ""}`}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {/* Drag handle indicator */}
              <div
                {...dragHandleProps}
                className="text-gray-400 hover:text-gray-600 cursor-move transition-colors"
                title="Arrastra para reordenar"
              >
                <GripVertical className="h-4 w-4" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {column.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {cardCount} {cardCount === 1 ? "tarjeta" : "tarjetas"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditColumn}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-gray-200"
                title="Editar columna"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenDeleteDialog}
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
            ref={setCardsContainerRef}
            className="cards-container flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-2 -mr-2 min-h-[100px]"
          >
            {/* Drop indicator for empty column - always show when dragging over empty space */}
            {(!column.cards || column.cards.length === 0) && (
              <DropIndicator
                isVisible={shouldShowDropIndicator?.(column.id, 0) || false}
              />
            )}

            <SortableContext
              items={column.cards?.map((card) => card.id) || []}
              strategy={verticalListSortingStrategy}
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
                          onClick={handleOpenEditCard}
                          onEdit={handleOpenEditCard}
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
                <div className="flex items-center justify-center h-10 text-gray-400 text-sm">
                  No hay tarjetas
                </div>
              )}
            </SortableContext>

            {/* Botón que se mueve junto con las tarjetas inicialmente */}
            <div className="pt-3 sticky bottom-0 bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-gray-600 border-dashed hover:bg-gray-50"
                disabled={isLoading}
                onClick={handleOpenCreateCardDialog}
              >
                + Agregar tarjeta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={handleCloseDeleteDialog}>
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
              onClick={handleCloseDeleteDialog}
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
        onClose={handleCloseCreateCardDialog}
        onSubmit={handleCreateCard}
        columnId={column.id}
        isLoading={isLoading}
      />

      {/* Edit Card Dialog - Usar CardDetailModal para edición completa */}
      {editingCard && (
        <CardDetailModal
          isOpen={true}
          onClose={handleCloseEditCard}
          card={editingCard}
          onSave={handleEditCard}
          onDelete={() => handleDeleteRequest(editingCard.id)}
          columnName={column.name}
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
