import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface CardDescriptionProps {
  isEditing: boolean;
  isSaving: boolean;
  description: string;
  setDescription: (description: string) => void;
  startEditing: () => void;
}

export function CardDescription({
  isEditing,
  isSaving,
  description,
  setDescription,
  startEditing,
}: CardDescriptionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <FileText className="h-4 w-4" />
        Descripción
      </div>
      {isEditing ? (
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Agregar descripción..."
          rows={6}
          className="min-h-[140px] resize-none w-full border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={isSaving}
        />
      ) : description ? (
        <div
          className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border min-h-[140px] break-words overflow-hidden cursor-pointer hover:bg-gray-100"
          onClick={startEditing}
        >
          {description}
        </div>
      ) : (
        <div
          className="text-gray-500 text-sm cursor-pointer hover:bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 min-h-[140px] flex items-center justify-center hover:border-gray-400 transition-colors"
          onClick={startEditing}
        >
          Hacer clic para agregar descripción...
        </div>
      )}
    </div>
  );
}
