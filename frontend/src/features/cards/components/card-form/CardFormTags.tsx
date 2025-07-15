import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { PREDEFINED_TAGS } from "../../helpers/cardHelpers";

interface CardFormTagsProps {
  tags: string[];
  newTag: string;
  setNewTag: (tag: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function CardFormTags({
  tags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  handleTagKeyDown,
  isLoading,
}: CardFormTagsProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="tags">Etiquetas</Label>

      {/* Etiquetas existentes */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-gray-300 rounded-full"
                onClick={() => removeTag(tag)}
                disabled={isLoading}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input para nueva etiqueta */}
      <Input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleTagKeyDown}
        placeholder="Agregar etiqueta y presionar Enter"
        disabled={isLoading}
      />

      {/* Etiquetas sugeridas */}
      <div className="flex flex-wrap gap-1">
        {PREDEFINED_TAGS.filter((tag) => !tags.includes(tag))
          .slice(0, 6)
          .map((tag) => (
            <Button
              key={tag}
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => addTag(tag)}
              disabled={isLoading}
            >
              + {tag}
            </Button>
          ))}
      </div>
    </div>
  );
}
