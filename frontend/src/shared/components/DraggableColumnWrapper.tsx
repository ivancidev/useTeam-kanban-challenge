"use client";

import { DraggableColumnWrapperProps } from "../types";


export function DraggableColumnWrapper({
  columnId,
  index,
  isDragging,
  isTarget,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  children,
}: DraggableColumnWrapperProps) {
  return (
    <div
      className="relative flex-shrink-0"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, index);
      }}
    >
      {/* Drop indicator */}
      {isTarget && (
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-20 shadow-lg animate-pulse" />
      )}

      <div
        className={`
          transition-all duration-200 ease-in-out
          ${isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"}
        `}
        draggable
        onDragStart={(e) => {
          console.log("Column drag start:", columnId);
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", columnId);
          onDragStart(columnId);
        }}
        onDragEnd={onDragEnd}
      >
        {children}
      </div>
    </div>
  );
}
