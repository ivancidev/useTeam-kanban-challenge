import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag } from "lucide-react";
import { CardPriorityBadge, CardTypeBadge } from "../ui";
import { CardPriority, CardType, Card } from "../../types";
import { CARD_PRIORITY_OPTIONS, CARD_TYPE_OPTIONS } from "../../helpers/cardHelpers";

interface CardTypePriorityProps {
  card: Card;
  isEditing: boolean;
  type: CardType;
  priority: CardPriority;
  setType: (type: CardType) => void;
  setPriority: (priority: CardPriority) => void;
}

export function CardTypePriority({
  card,
  isEditing,
  type,
  priority,
  setType,
  setPriority,
}: CardTypePriorityProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Tag className="h-4 w-4" />
        Tipo y Prioridad
      </div>
      {isEditing ? (
        <div className="space-y-3">
          <Select
            value={type}
            onValueChange={(value) => setType(value as CardType)}
          >
            <SelectTrigger className="w-full h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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

          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as CardPriority)}
          >
            <SelectTrigger className="w-full h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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
      ) : (
        <div className="flex gap-2">
          <CardTypeBadge type={card.type} size="md" />
          <CardPriorityBadge priority={card.priority} size="md" />
        </div>
      )}
    </div>
  );
}
