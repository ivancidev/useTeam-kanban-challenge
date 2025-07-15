import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CardFormDueDateProps {
  dueDate: string;
  setDueDate: (dueDate: string) => void;
  isLoading: boolean;
}

export function CardFormDueDate({
  dueDate,
  setDueDate,
  isLoading,
}: CardFormDueDateProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="dueDate">Fecha límite</Label>
      <Input
        id="dueDate"
        type="date"
        value={dueDate ? dueDate.split("T")[0] : ""}
        onChange={(e) => setDueDate(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
}
