import { Clock } from "lucide-react";
import { Card } from "../../types";
import { formatCardDate } from "../../helpers/cardHelpers";

interface CardDateInfoProps {
  card: Card;
}

export function CardDateInfo({ card }: CardDateInfoProps) {
  return (
    <div className="space-y-3 pt-6 border-t-2 border-gray-200 mt-8 mb-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Clock className="h-4 w-4" />
        Información de fechas
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Creada:</span>
          <span className="break-words">{formatCardDate(card.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Actualizada:</span>
          <span className="break-words">{formatCardDate(card.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
