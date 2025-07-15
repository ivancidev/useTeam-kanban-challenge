import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardPriority, CardType } from "../../types";
import {
  CARD_PRIORITY_OPTIONS,
  CARD_TYPE_OPTIONS,
} from "../../helpers/cardHelpers";

interface CardFormTypePriorityProps {
  type: CardType;
  priority: CardPriority;
  setType: (type: CardType) => void;
  setPriority: (priority: CardPriority) => void;
}

export function CardFormTypePriority({
  type,
  priority,
  setType,
  setPriority,
}: CardFormTypePriorityProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as CardType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            {CARD_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="priority">Prioridad</Label>
        <Select
          value={priority}
          onValueChange={(value) => setPriority(value as CardPriority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar prioridad" />
          </SelectTrigger>
          <SelectContent>
            {CARD_PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
