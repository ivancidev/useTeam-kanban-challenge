import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Card } from "../../types";

interface CardDetailHeaderProps {
  card: Card;
  columnName: string;
  isEditing: boolean;
  isSaving: boolean;
  title: string;
  setTitle: (title: string) => void;
  startEditing: () => void;
}

export function CardDetailHeader({
  card,
  columnName,
  isEditing,
  isSaving,
  title,
  setTitle,
  startEditing,
}: CardDetailHeaderProps) {
  return (
    <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-16">
            {/* Título editable */}
            {isEditing ? (
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold mb-2 resize-none min-h-[3rem] max-h-[8rem] border-0 bg-transparent focus:bg-white focus:border-gray-300 leading-tight w-full"
                style={{
                  lineHeight: "1.3",
                  overflow: "hidden",
                  scrollbarWidth: "thin",
                  maxWidth: "100%",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                }}
                placeholder="Título de la tarjeta"
                disabled={isSaving}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  const newHeight = Math.max(
                    48,
                    Math.min(target.scrollHeight, 128)
                  ); // min 3rem, max 8rem
                  target.style.height = newHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    // Podrías agregar lógica para guardar o cambiar el foco aquí
                  }
                }}
              />
            ) : (
              <DialogTitle
                className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded break-words"
                onClick={startEditing}
              >
                {card.title}
              </DialogTitle>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>en la lista</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
              {columnName}
            </span>
            {/* Indicador de modo edición */}
            {isEditing && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium flex items-center gap-1">
                <Edit className="h-3 w-3" />
                Editando
              </span>
            )}
          </div>

          {/* Botón de editar */}
          {!isEditing && (
            <Button
              onClick={startEditing}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>
    </DialogHeader>
  );
}
