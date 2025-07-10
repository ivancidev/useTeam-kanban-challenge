"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBoard } from "../hooks/useBoard";
import { ColumnCard } from "../../columns/components/ColumnCard";
import { ColumnFormDialog } from "../../columns/components/ColumnFormDialog";
import { DragDropProvider } from "@/shared/components/DragDropProvider";
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
  } = useBoard();

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
    // This function will be used by ColumnCard to update local column state
    // The actual state management is handled by useBoard hook
    // This is just a placeholder for future optimizations
    console.log("Column updated:", updatedColumn);
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
    <DragDropProvider columns={columns} onMoveCard={handleMoveCard}>
      <div className="p-6">
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
        </div>

        {/* Columns Container */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {isLoading && columns.length === 0 ? (
            // Loading skeleton
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-80 h-96 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : columns.length > 0 ? (
            // Columns
            columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <ColumnCard
                  key={column.id}
                  column={column}
                  onEdit={setEditingColumn}
                  onDelete={handleDeleteColumn}
                  onColumnUpdate={handleColumnUpdate}
                  isLoading={isLoading}
                />
              ))
          ) : (
            // Empty state
            <div className="flex items-center justify-center w-full h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sin columnas
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando tu primera columna para organizar las tareas
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

        {/* Create Column Dialog */}
        <ColumnFormDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreateColumn}
          isLoading={isLoading}
        />

        {/* Edit Column Dialog */}
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
