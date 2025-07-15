"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useColumnCard } from "../hooks";
import { ColumnCardProps } from "../types";
import { columnAnimations } from "@/shared/helpers/animationHelpers";
import { getColumnColorById } from "@/shared/helpers/colorHelpers";

import {
  ColumnHeader,
  ColumnContent,
  ColumnDeleteDialog,
  CardDeleteDialog,
  ColumnDialogs,
} from "./column-card";

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
          <ColumnHeader
            columnName={column.name}
            cardCount={cardCount}
            columnColor={columnColor}
            isLoading={isLoading}
            dragHandleProps={dragHandleProps}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleOpenDeleteDialog}
          />

          <ColumnContent
            cards={column.cards || []}
            columnId={column.id}
            columnColor={columnColor}
            isLoading={isLoading}
            shouldShowDropIndicator={shouldShowDropIndicator}
            setCardsContainerRef={setCardsContainerRef}
            onEditCard={handleOpenEditCard}
            onDeleteCard={handleDeleteRequest}
            onCreateCard={handleOpenCreateCardDialog}
          />
        </Card>
      </motion.div>

      <ColumnDeleteDialog
        isOpen={showDeleteDialog}
        columnName={column.name}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />

      <CardDeleteDialog
        isOpen={isConfirmOpen}
        cards={column.cards || []}
        pendingDeleteId={pendingDeleteId}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <ColumnDialogs
        showCreateCardDialog={showCreateCardDialog}
        onCloseCreateCard={handleCloseCreateCardDialog}
        onCreateCard={handleCreateCard}
        columnId={column.id}
        editingCard={editingCard}
        onCloseEditCard={handleCloseEditCard}
        onEditCard={handleEditCard}
        columnName={column.name}
        isLoading={isLoading}
      />
    </>
  );
}
