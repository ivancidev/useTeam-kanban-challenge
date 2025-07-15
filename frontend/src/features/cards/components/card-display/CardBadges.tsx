import { CardPriorityBadge, CardTypeBadge } from "../ui";
import { Card } from "../../types";

interface CardBadgesProps {
  card: Card;
  showType: boolean;
  showPriority: boolean;
}

export function CardBadges({ card, showType, showPriority }: CardBadgesProps) {
  if (!showType && !showPriority) return null;

  return (
    <div className="flex gap-1 mb-2">
      {showType && <CardTypeBadge type={card.type} size="sm" />}
      {showPriority && <CardPriorityBadge priority={card.priority} size="sm" />}
    </div>
  );
}
