import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { CardDueDateDisplay } from "../ui";

interface CardDueDateProps {
  isEditing: boolean;
  isSaving: boolean;
  dueDate: string | null;
  setDueDate: (date: string) => void;
  startEditing: () => void;
}

export function CardDueDate({
  isEditing,
  isSaving,
  dueDate,
  setDueDate,
  startEditing,
}: CardDueDateProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Calendar className="h-4 w-4" />
        Fecha límite
      </div>
      {isEditing ? (
        <Input
          type="date"
          value={dueDate ? dueDate.split("T")[0] : ""}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={isSaving}
        />
      ) : dueDate ? (
        <CardDueDateDisplay dueDate={dueDate} size="md" />
      ) : (
        <span
          className="text-gray-500 text-sm cursor-pointer hover:text-gray-700"
          onClick={startEditing}
        >
          Hacer clic para agregar fecha límite
        </span>
      )}
    </div>
  );
}
