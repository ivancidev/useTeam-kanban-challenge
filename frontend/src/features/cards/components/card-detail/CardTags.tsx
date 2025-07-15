import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, X, Plus } from "lucide-react";
import { CardTagsDisplay } from "../ui";
import { PREDEFINED_TAGS } from "../../helpers/cardHelpers";

interface CardTagsProps {
  isEditing: boolean;
  isSaving: boolean;
  tags: string[];
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: () => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  startEditing: () => void;
}

export function CardTags({
  isEditing,
  isSaving,
  tags,
  newTag,
  setNewTag,
  handleAddTag,
  handleTagKeyDown,
  addTag,
  removeTag,
  startEditing,
}: CardTagsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Tag className="h-4 w-4" />
        Etiquetas
      </div>
      {isEditing ? (
        <div className="space-y-4">
          {/* Etiquetas actuales */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-2 max-w-[250px] h-8"
                >
                  <span className="truncate">{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-gray-300 rounded-full flex-shrink-0"
                    onClick={() => removeTag(tag)}
                    disabled={isSaving}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Agregar nueva etiqueta */}
          <div className="flex gap-3">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Nueva etiqueta"
              className="flex-1 h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              disabled={isSaving}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              disabled={!newTag.trim() || isSaving}
              className="h-11 px-4 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Etiquetas sugeridas */}
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.filter((tag) => !tags.includes(tag))
              .slice(0, 6)
              .map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => addTag(tag)}
                  disabled={isSaving}
                >
                  + {tag}
                </Button>
              ))}
          </div>
        </div>
      ) : tags && tags.length > 0 ? (
        <CardTagsDisplay tags={tags} maxVisible={10} size="md" />
      ) : (
        <span
          className="text-gray-500 text-sm cursor-pointer hover:text-gray-700"
          onClick={startEditing}
        >
          Hacer clic para agregar etiquetas
        </span>
      )}
    </div>
  );
}
