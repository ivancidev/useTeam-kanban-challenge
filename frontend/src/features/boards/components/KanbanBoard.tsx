"use client";

// Librerías externas
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Shared internos (absolutos)
import { DragDropProvider } from "@/shared/components/DragDropProvider";
import { actionIcons, uiIcons } from "@/shared/helpers/iconHelpers";
import {
  containerAnimations,
  buttonAnimations,
} from "@/shared/helpers/animationHelpers";
import {
  backgroundGradients,
  getButtonClasses,
} from "@/shared/helpers/colorHelpers";

// Feature específicos (relativos)
import { VirtualizedColumnsList } from "../../columns/components/VirtualizedColumnsList";
import { ColumnFormDialog } from "../../columns/components/ColumnFormDialog";
import { useKanbanBoardLogic } from "../hooks";
import { useKanbanScrollLogic } from "../hooks/useKanbanScrollLogic";

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
    return (
      <motion.div
        className="flex items-center justify-center h-64"
        initial="hidden"
        animate="visible"
        variants={containerAnimations}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <motion.button
            onClick={() => loadBoard()}
            className={getButtonClasses("secondary")}
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            Reintentar
          </motion.button>
        </div>
      </motion.div>
    );
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
        {/* Header moderno con gradiente */}
        <motion.div
          className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Icono mejorado con animación */}
              <motion.div
                className="p-2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-md shadow-sm"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <uiIcons.kanban className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                  Tablero Kanban
                </h1>
                <p className="text-slate-600 text-xs font-medium">
                  Gestiona tus tareas de forma visual y colaborativa
                </p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={openCreateDialog}
            disabled={isLoading}
            className={`${getButtonClasses(
              "primary"
            )} flex items-center gap-2 shadow-md px-3 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200`}
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            <actionIcons.add className="h-4 w-4" />
            <span>Nueva Columna</span>
          </motion.button>
        </motion.div>
        {/* Contenedor de columnas con animaciones */}
        <div className="relative pb-2">
          {/* Padding reducido para menos separación, pero manteniendo espacio para hover */}

          {/* Botón de scroll izquierdo */}
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={scrollToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-3 shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-200"
            >
              <FiChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {/* Botón de scroll derecho */}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onClick={scrollToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-3 shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-200"
            >
              <FiChevronRight className="w-5 h-5" />
            </motion.button>
          )}

          <div
            className="kanban-horizontal-scroll overflow-x-auto overflow-y-hidden pb-8 scroll-smooth"
            style={{ height: "calc(100vh - 10px)" }}
            onScroll={(e) => updateScrollButtons(e.currentTarget)}
          >
            <motion.div className="flex gap-6" variants={containerAnimations}>
              {isLoading && columns.length === 0 ? (
                // Skeleton de carga mejorado
                <AnimatePresence>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-80 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-pulse flex-shrink-0 shadow-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </AnimatePresence>
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
                <motion.div
                  className="flex items-center justify-center w-full h-96"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <actionIcons.add className="h-10 w-10 text-blue-500" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Sin columnas aún
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm">
                      Comienza creando tu primera columna para organizar las
                      tareas de tu proyecto
                    </p>
                    <motion.button
                      onClick={openCreateDialog}
                      disabled={isLoading}
                      className={getButtonClasses("primary")}
                      variants={buttonAnimations}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Crear primera columna
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
        {/* Dialogs con animaciones */}
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
