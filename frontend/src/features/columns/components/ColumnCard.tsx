"use client";

import { motion } from "framer-motion";
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
import { VirtualizedCardsList } from "../../cards/components/VirtualizedCardsList";
import { CardFormDialog } from "../../cards/components/CardFormDialog";
import { CardDetailModal } from "../../cards/components/CardDetailModal";
import { DropIndicator } from "../../cards/components/DropIndicator";
import { useColumnCard } from "../hooks";
import { ColumnCardProps } from "../types";
import { actionIcons, uiIcons } from "@/shared/helpers/iconHelpers";
import {
  columnAnimations,
  buttonAnimations,
} from "@/shared/helpers/animationHelpers";
import {
  getColumnColorById,
  getButtonClasses,
} from "@/shared/helpers/colorHelpers";

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

  const columnColor = getColumnColorById(column.id);

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={dragStyle}
        variants={columnAnimations}
        initial="hidden"
        animate="visible"
        layout
        whileHover={{
          y: -2,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 30,
          },
        }}
        className="m-0 p-0"
      >
        <Card
          className={`w-80 ${
            columnColor.shadow
          } transition-all duration-200 flex flex-col h-full rounded-lg overflow-visible !border-0 !border-none !border-t-0 gap-0 transform-gpu will-change-transform bg-transparent ${
            isOver ? `${columnColor.medium} ${columnColor.shadow}` : ""
          } ${isDragging ? "opacity-50" : ""}`}
        >
          <CardHeader
            className={`pb-3 pt-4 px-4 flex-shrink-0 ${columnColor.header} rounded-t-lg !border-0 !border-none !border-t-0 m-0 gap-0`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Drag handle indicator mejorado */}
                <div
                  {...dragHandleProps}
                  className="text-white/70 hover:text-white cursor-move transition-colors p-1 rounded hover:bg-white/10"
                  title="Arrastra para reordenar"
                >
                  <uiIcons.drag className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-white truncate text-lg">
                    {column.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-white/80 text-sm">
                      {cardCount} {cardCount === 1 ? "tarjeta" : "tarjetas"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <motion.button
                  onClick={handleEditColumn}
                  disabled={isLoading}
                  className="h-8 w-8 p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors disabled:opacity-50"
                  title="Editar columna"
                  variants={buttonAnimations}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <actionIcons.edit className="h-4 w-4" />
                </motion.button>

                <motion.button
                  onClick={handleOpenDeleteDialog}
                  disabled={isLoading}
                  className="h-8 w-8 p-1 rounded-md hover:bg-red-500/20 text-white/80 hover:text-red-200 transition-colors disabled:opacity-50"
                  title="Eliminar columna"
                  variants={buttonAnimations}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <actionIcons.delete className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </CardHeader>

          <CardContent
            className={`pt-4 pb-4 px-3 flex-1 flex flex-col overflow-visible ${columnColor.light}`}
          >
            <div
              ref={setCardsContainerRef}
              className="cards-container flex-1 h-full mt-1 pt-1 overflow-visible"
            >
              {/* Drop indicator for empty column */}
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
                  <VirtualizedCardsList
                    cards={column.cards.sort((a, b) => a.order - b.order)}
                    onEdit={handleOpenEditCard}
                    onDelete={handleDeleteRequest}
                    onClick={handleOpenEditCard}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="flex items-center justify-center h-10 text-gray-400 text-sm">
                    No hay tarjetas
                  </div>
                )}
              </SortableContext>

              {/* Botón moderno para agregar tarjeta - mejorado y más visible */}
              <div className="pt-3 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent">
                <motion.button
                  onClick={handleOpenCreateCardDialog}
                  disabled={isLoading}
                  className="w-full py-3 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 font-medium bg-white/80 backdrop-blur-sm"
                  variants={buttonAnimations}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <actionIcons.add className="h-4 w-4" />
                  Agregar tarjeta
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
            <motion.button
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
              className={getButtonClasses("secondary")}
              variants={buttonAnimations}
              whileHover="hover"
              whileTap="tap"
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleDelete}
              disabled={isDeleting}
              className={getButtonClasses("danger")}
              variants={buttonAnimations}
              whileHover="hover"
              whileTap="tap"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </motion.button>
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
            <motion.button
              onClick={cancelDelete}
              className={getButtonClasses("secondary")}
              variants={buttonAnimations}
              whileHover="hover"
              whileTap="tap"
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleConfirmDelete}
              className={getButtonClasses("danger")}
              variants={buttonAnimations}
              whileHover="hover"
              whileTap="tap"
            >
              Eliminar
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
