"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnCard } from "../../columns/components/ColumnCard";
import { ColumnFormDialog } from "../../columns/components/ColumnFormDialog";
import { DragDropProvider } from "@/shared/components/DragDropProvider";
import { ConnectionIndicator } from "@/shared/components/ConnectionIndicator";
import { useKanbanBoardLogic } from "../hooks";

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
      onMoveColumn={moveColumn}
      onDragPositionChange={handleDragPositionChange}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tablero Kanban
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus tareas de forma visual
              </p>
            </div>

            {/* Indicador de conexión en tiempo real */}
            <ConnectionIndicator showUsers={true} showLastUpdate={false} />
          </div>

          <Button
            onClick={openCreateDialog}
            disabled={isLoading}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Columna
          </Button>
        </div>
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
                columns
                  .sort((a, b) => a.order - b.order)
                  .map((column, index) => (
                    <ColumnCard
                      key={column.id}
                      column={column}
                      index={index}
                      onEdit={openEditDialog}
                      onDelete={handleDeleteColumn}
                      onColumnUpdate={handleColumnUpdate}
                      isLoading={isLoading}
                      shouldShowDropIndicator={shouldShowDropIndicator}
                      dragState={dragState}
                    />
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
                    <Button onClick={openCreateDialog} disabled={isLoading}>
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
          onClose={closeCreateDialog}
          onSubmit={handleCreateColumn}
          isLoading={isLoading}
        />
        {editingColumn && (
          <ColumnFormDialog
            isOpen={true}
            onClose={closeEditDialog}
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
