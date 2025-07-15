"use client";

import { useState } from "react";

export function useDeleteConfirmation() {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsConfirmOpen(false);
    return pendingDeleteId;
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };

  return {
    pendingDeleteId,
    isConfirmOpen,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
