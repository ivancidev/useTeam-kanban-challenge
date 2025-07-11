"use client";

import { useState, useEffect } from "react";
import { columnsApi } from "../services/api";
import { boardsApi } from "../../boards/services/api";
import type { Board } from "../../boards/types";
import type { Column, CreateColumnDto, UpdateColumnDto } from "../types";

export function useColumns() {
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get or create default board
      const board = await boardsApi.getDefaultBoard();
      setCurrentBoard(board);

      // Load columns for this board
      const boardColumns = await columnsApi.getColumns(board.id);
      setColumns(boardColumns);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load board";
      setError(errorMessage);
      console.error("Error loading board:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createColumn = async (data: CreateColumnDto) => {
    if (!currentBoard) return;

    try {
      setIsLoading(true);
      setError(null);
      // Add boardId to the data
      const columnData = { ...data, boardId: currentBoard.id };
      const newColumn = await columnsApi.createColumn(columnData);

      // Add to local state
      setColumns((prev) => [...prev, newColumn]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create column";
      setError(errorMessage);
      console.error("Error creating column:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editColumn = async (id: string, data: UpdateColumnDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedColumn = await columnsApi.updateColumn(id, data);
      

      // Update local state
      setColumns((prev) =>
        prev.map((col) => (col.id === id ? updatedColumn : col))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update column";
      setError(errorMessage);
      console.error("Error updating column:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await columnsApi.deleteColumn(id);

      // Remove from local state
      setColumns((prev) => prev.filter((col) => col.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete column";
      setError(errorMessage);
      console.error("Error deleting column:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Load board on mount
  useEffect(() => {
    loadBoard();
  }, []);

  return {
    columns,
    currentBoard,
    isLoading,
    error,
    loadBoard,
    createColumn,
    editColumn,
    deleteColumn,
    clearError,
  };
}
