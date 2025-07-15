import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface CardDetailFooterProps {
  isEditing: boolean;
  isSaving: boolean;
  cancelEditing: () => void;
  saveChanges: () => void;
}

export function CardDetailFooter({
  isEditing,
  isSaving,
  cancelEditing,
  saveChanges,
}: CardDetailFooterProps) {
  if (!isEditing) return null;

  return (
    <div className="border-t-2 bg-gray-50 px-6 py-4 flex-shrink-0 sticky bottom-0">
      <div className="flex items-center justify-between w-full">
        <div className="text-xs text-gray-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 text-xs bg-gray-300 border border-gray-400 rounded shadow-sm font-mono">
              Ctrl+Enter
            </kbd>
            <span className="ml-1">Guardar</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 text-xs bg-gray-300 border border-gray-400 rounded shadow-sm font-mono">
              Esc
            </kbd>
            <span className="ml-1">Cancelar</span>
          </span>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={cancelEditing}
            variant="outline"
            disabled={isSaving}
            className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={saveChanges}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
