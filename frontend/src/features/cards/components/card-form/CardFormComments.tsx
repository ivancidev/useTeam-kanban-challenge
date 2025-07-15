import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CardFormCommentsProps {
  comments: string;
  setComments: (comments: string) => void;
  isLoading: boolean;
}

export function CardFormComments({
  comments,
  setComments,
  isLoading,
}: CardFormCommentsProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="comments">Comentarios</Label>
      <Textarea
        id="comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Comentarios adicionales..."
        rows={2}
        className="min-h-[60px] max-h-[100px] resize-none overflow-y-auto"
        disabled={isLoading}
      />
    </div>
  );
}
