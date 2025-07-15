import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface CardCommentsProps {
  isEditing: boolean;
  isSaving: boolean;
  comments: string;
  setComments: (comments: string) => void;
  startEditing: () => void;
}

export function CardComments({
  isEditing,
  isSaving,
  comments,
  setComments,
  startEditing,
}: CardCommentsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MessageSquare className="h-4 w-4" />
        Comentarios
      </div>
      {isEditing ? (
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Agregar comentarios..."
          rows={4}
          className="min-h-[100px] resize-none w-full border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={isSaving}
        />
      ) : comments ? (
        <div
          className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-purple-200 min-h-[100px] break-words overflow-hidden cursor-pointer hover:bg-purple-100"
          onClick={startEditing}
        >
          {comments}
        </div>
      ) : (
        <div
          className="text-gray-500 text-sm cursor-pointer hover:bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 min-h-[100px] flex items-center justify-center hover:border-gray-400 transition-colors"
          onClick={startEditing}
        >
          Hacer clic para agregar comentarios...
        </div>
      )}
    </div>
  );
}
