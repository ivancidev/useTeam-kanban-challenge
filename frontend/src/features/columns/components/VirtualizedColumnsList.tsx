"use client";

import { memo } from "react";
import type { Column } from "../types";
import { ColumnCard } from "./ColumnCard";
import { useVirtualizedColumns } from "../hooks/useVirtualizedColumns";
import { COLUMN_VIRTUALIZATION_CONFIG } from "../helpers/columnVirtualizationHelpers";

interface VirtualizedColumnsListProps {
  columns: Column[];
  onEdit: (column: Column) => void;
  onDelete: (columnId: string) => void;
  onColumnUpdate: (updatedColumn: Column) => void;
  isLoading: boolean;
  shouldShowDropIndicator: (columnId: string, position: number) => boolean;
  dragState: {
    isDragging: boolean;
    activeCardId: string | null;
    targetColumnId: string | null;
    insertPosition: number | null;
  };
}

export const VirtualizedColumnsList = memo(function VirtualizedColumnsList({
  columns,
  onEdit,
  onDelete,
  onColumnUpdate,
  isLoading,
  shouldShowDropIndicator,
  dragState,
}: VirtualizedColumnsListProps) {
  const sortedColumns = columns.sort((a, b) => a.order - b.order);

  // Siempre intentar usar virtualización
  const { virtualItems, totalSize } = useVirtualizedColumns({
    columns: sortedColumns,
    enabled: true, // Siempre habilitado
  });

  // Si el virtualizador funciona, usarlo
  if (virtualItems.length > 0) {
    return (
      <div
        style={{
          width: totalSize > 0 ? `${totalSize}px` : "auto",
          position: "relative",
          height: "100%",
          overflow: "visible",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const column = sortedColumns[virtualItem.index];
          if (!column) return null;

          return (
            <div
              key={column.id}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE}px`,
                transform: `translateX(${virtualItem.start}px)`,
              }}
            >
              <ColumnCard
                column={column}
                index={virtualItem.index}
                onEdit={onEdit}
                onDelete={onDelete}
                onColumnUpdate={onColumnUpdate}
                isLoading={isLoading}
                shouldShowDropIndicator={shouldShowDropIndicator}
                dragState={dragState}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback: si el virtualizador falla, renderizar todas las columnas con absolute positioning
  const totalFallbackSize =
    sortedColumns.length *
    (COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE +
      COLUMN_VIRTUALIZATION_CONFIG.COLUMN_MARGIN);

  return (
    <div
      style={{
        width: `${totalFallbackSize}px`,
        position: "relative",
        height: "100%",
        overflow: "visible",
      }}
    >
      {sortedColumns.map((column, index) => (
        <div
          key={column.id}
          style={{
            position: "absolute",
            top: 0,
            left:
              index *
              (COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE +
                COLUMN_VIRTUALIZATION_CONFIG.COLUMN_MARGIN),
            width: `${COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE}px`,
            height: "100%",
          }}
        >
          <ColumnCard
            column={column}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onColumnUpdate={onColumnUpdate}
            isLoading={isLoading}
            shouldShowDropIndicator={shouldShowDropIndicator}
            dragState={dragState}
          />
        </div>
      ))}
    </div>
  );
});
