"use client";

import { CardDisplayProps } from "../types";
import { getCardColor } from "@/shared/helpers/colorHelpers";
import { useCardDisplayLogic } from "../hooks";

import {
  CardActionButtons,
  CardTitle,
  CardBadges,
  CardDueDateSection,
  CardTagsSection,
  CardContentIndicators,
} from "./card-display";

export function CardDisplay({
  card,
  className = "",
  onEdit,
  onDelete,
}: CardDisplayProps) {
  const cardColor = getCardColor(card.id);
  const cardInfo = useCardDisplayLogic(card);
  const hasActionButtons = !!(onEdit || onDelete);

  return (
    <div
      className={`
      relative group p-3 ${cardColor.background}
      rounded-xl border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl ${cardColor.shadow}
      w-full max-w-none overflow-visible
      box-border flex flex-col
      transition-all duration-200 ease-out
      hover:-translate-y-0.5
      backdrop-blur-sm
      ring-2 ring-gray-200 hover:ring-gray-300 ${cardColor.border}
      isolate
      bg-gradient-to-br from-white/98 to-white/95
      outline-1 outline-gray-200/50
      ${className}
    `}
    >
      <CardActionButtons card={card} onEdit={onEdit} onDelete={onDelete} />

      <CardTitle title={card.title} hasActionButtons={hasActionButtons} />

      <CardBadges
        card={card}
        showType={cardInfo.showType}
        showPriority={cardInfo.showPriority}
      />

      <CardDueDateSection
        dueDate={card.dueDate!}
        hasDueDate={!!cardInfo.hasDueDate}
      />

      <CardTagsSection tags={card.tags} hasTags={!!cardInfo.hasTags} />

      <CardContentIndicators
        hasDescription={!!cardInfo.hasDescription}
        hasComments={!!cardInfo.hasComments}
      />
    </div>
  );
}
