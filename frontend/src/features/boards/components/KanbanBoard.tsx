"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBoard } from "../hooks/useBoard";
import { ColumnCard } from "../../columns/components/ColumnCard";
import { ColumnFormDialog } from "../../columns/components/ColumnFormDialog";
import { DragDropProvider } from "@/shared/components/DragDropProvider";
import { useDragStore } from "@/shared/stores/dragStore";
import type {
  Column,
  CreateColumnDto,
  UpdateColumnDto,
} from "../../columns/types";

export function KanbanBoard() {
  const {
    columns,
    isLoading,
    error,
    createColumn,
    editColumn,
    deleteColumn,
    loadBoard,
    moveCard,
    updateColumnState,
  } = useBoard();

  const dragStore = useDragStore();
  const shouldShowDropIndicator = (columnId: string, position: number) => {
    return (
      dragStore.isDragging &&
      dragStore.targetColumnId === columnId &&
      dragStore.insertPosition === position
    );
  };

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  const handleCreateColumn = async (data: CreateColumnDto) => {
    await createColumn(data);
    setShowCreateDialog(false);
  };

  const handleEditColumn = async (data: UpdateColumnDto) => {
    if (!editingColumn) return;
    await editColumn(editingColumn.id, data);
    setEditingColumn(null);
  };

  const handleDeleteColumn = async (columnId: string) => {
    await deleteColumn(columnId);
  };

  const handleMoveCard = async (
    cardId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    await moveCard(cardId, targetColumnId, newOrder);
  };

  const handleColumnUpdate = (updatedColumn: Column) => {
    updateColumnState(updatedColumn);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => loadBoard()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DragDropProvider
      columns={columns}
      onMoveCard={handleMoveCard}
      onDragPositionChange={(state) => {
        dragStore.setDragState(state);
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tablero Kanban</h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus tareas de forma visual
            </p>
          </div>

          <Button
            onClick={() => setShowCreateDialog(true)}
            disabled={isLoading}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Columna
          </Button>
        </div>{" "}
        {/* Columns Container */}
        <div className="relative">
          {/* Scroll Indicators */}
          {columns.length > 3 && (
            <>
              <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            </>
          )}

          <div className="kanban-horizontal-scroll overflow-x-auto overflow-y-hidden pb-6 scroll-smooth">
            <div className="flex gap-4 min-w-max px-2">
              {isLoading && columns.length === 0 ? (
                // Loading skeleton
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-80 h-96 bg-gray-100 rounded-lg animate-pulse flex-shrink-0"
                    />
                  ))}
                </>
              ) : columns.length > 0 ? (
                // Columns
                columns
                  .sort((a, b) => a.order - b.order)
                  .map((column) => (
                    <div key={column.id} className="flex-shrink-0">
                      <ColumnCard
                        column={column}
                        onEdit={setEditingColumn}
                        onDelete={handleDeleteColumn}
                        onColumnUpdate={handleColumnUpdate}
                        isLoading={isLoading}
                        shouldShowDropIndicator={shouldShowDropIndicator}
                        dragState={{
                          isDragging: dragStore.isDragging,
                          activeCardId: dragStore.activeCardId,
                          targetColumnId: dragStore.targetColumnId,
                          insertPosition: dragStore.insertPosition,
                        }}
                      />
                    </div>
                  ))
              ) : (
                <div className="flex items-center justify-center w-full h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sin columnas
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comienza creando tu primera columna para organizar las
                      tareas
                    </p>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      disabled={isLoading}
                    >
                      Crear primera columna
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <ColumnFormDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreateColumn}
          isLoading={isLoading}
        />
        {editingColumn && (
          <ColumnFormDialog
            isOpen={true}
            onClose={() => setEditingColumn(null)}
            onSubmit={handleCreateColumn}
            onEdit={handleEditColumn}
            column={editingColumn}
            isLoading={isLoading}
          />
        )}
      </div>
    </DragDropProvider>
  );
}
