"use client";

import { KanbanBoard } from "@/features/boards/components/KanbanBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <KanbanBoard />
    </div>
  );
}
