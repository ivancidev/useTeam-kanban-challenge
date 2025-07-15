"use client";

import { memo } from "react";
import type { Column } from "../types";
import { ColumnCard } from "./ColumnCard";
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

  // Siempre usar el enfoque sin virtualización para simplificar
  const totalSize =
    sortedColumns.length *
    (COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE +
      COLUMN_VIRTUALIZATION_CONFIG.COLUMN_MARGIN);

  return (
    <div
      style={{
        width: `${totalSize}px`,
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
