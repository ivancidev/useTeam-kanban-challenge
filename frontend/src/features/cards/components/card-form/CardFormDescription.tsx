import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CardFormDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
  isLoading: boolean;
}

export function CardFormDescription({
  description,
  setDescription,
  isLoading,
}: CardFormDescriptionProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="description">Descripción</Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción opcional de la tarjeta"
        rows={3}
        className="min-h-[80px] max-h-[120px] resize-none overflow-y-auto"
        disabled={isLoading}
      />
    </div>
  );
}
