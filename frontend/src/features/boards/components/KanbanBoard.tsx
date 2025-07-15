"use client";

import { motion } from "framer-motion";

import { DragDropProvider } from "@/shared/components/DragDropProvider";
import { containerAnimations } from "@/shared/helpers/animationHelpers";
import { backgroundGradients } from "@/shared/helpers/colorHelpers";

import { VirtualizedColumnsList } from "../../columns/components/VirtualizedColumnsList";
import { ColumnFormDialog } from "../../columns/components/ColumnFormDialog";
import { useKanbanBoardLogic } from "../hooks";
import { useKanbanScrollLogic } from "../hooks/useKanbanScrollLogic";

import {
  KanbanBoardHeader,
  KanbanBoardErrorState,
  KanbanBoardLoadingSkeleton,
  KanbanBoardEmptyState,
  KanbanColumnsContainer,
} from "./ui";

export function KanbanBoard() {
  const {
    columns,
    isLoading,
    error,
    showCreateDialog,
    editingColumn,
    loadBoard,
    moveColumn,
    shouldShowDropIndicator,
    handleCreateColumn,
    handleEditColumn,
    handleDeleteColumn,
    handleColumnUpdate,
    handleMoveCard,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    handleDragPositionChange,
    dragState,
  } = useKanbanBoardLogic();

  const {
    canScrollLeft,
    canScrollRight,
    updateScrollButtons,
    scrollToNext,
    scrollToPrev,
  } = useKanbanScrollLogic({ columns });

  if (error) {
    return <KanbanBoardErrorState error={error} onRetry={() => loadBoard()} />;
  }

  return (
    <DragDropProvider
      columns={columns}
      onMoveCard={handleMoveCard}
      onMoveColumn={moveColumn}
      onDragPositionChange={handleDragPositionChange}
    >
      <motion.div
        className={`p-6 h-screen overflow-y-hidden ${backgroundGradients.main}`}
        initial="hidden"
        animate="visible"
        variants={containerAnimations}
      >
        <KanbanBoardHeader
          onCreateColumn={openCreateDialog}
          isLoading={isLoading}
        />

        <KanbanColumnsContainer
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={scrollToPrev}
          onScrollRight={scrollToNext}
          onScroll={updateScrollButtons}
        >
          {isLoading && columns.length === 0 ? (
            <KanbanBoardLoadingSkeleton />
          ) : columns.length > 0 ? (
            <VirtualizedColumnsList
              columns={columns}
              onEdit={openEditDialog}
              onDelete={handleDeleteColumn}
              onColumnUpdate={handleColumnUpdate}
              isLoading={isLoading}
              shouldShowDropIndicator={shouldShowDropIndicator}
              dragState={dragState}
            />
          ) : (
            <KanbanBoardEmptyState
              onCreateColumn={openCreateDialog}
              isLoading={isLoading}
            />
          )}
        </KanbanColumnsContainer>

        <ColumnFormDialog
          isOpen={showCreateDialog}
          onClose={closeCreateDialog}
          onSubmit={handleCreateColumn}
          columns={columns}
          isLoading={isLoading}
        />
        {editingColumn && (
          <ColumnFormDialog
            isOpen={true}
            onClose={closeEditDialog}
            onSubmit={handleCreateColumn}
            onEdit={handleEditColumn}
            column={editingColumn}
            columns={columns}
            isLoading={isLoading}
          />
        )}
      </motion.div>
    </DragDropProvider>
  );
}
