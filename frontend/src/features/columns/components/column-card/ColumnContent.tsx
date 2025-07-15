import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { VirtualizedCardsList } from "../../../cards/components/VirtualizedCardsList";
import { DropIndicator } from "../../../cards/components/ui/DropIndicator";

import { actionIcons } from "@/shared/helpers/iconHelpers";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";

import { Card } from "../../../cards/types";

interface ColumnContentProps {
  cards: Card[];
  columnId: string;
  columnColor: {
    light: string;
  };
  isLoading: boolean;
  shouldShowDropIndicator?: (columnId: string, index: number) => boolean;
  setCardsContainerRef: (element: HTMLDivElement | null) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
  onCreateCard: () => void;
}

export function ColumnContent({
  cards,
  columnId,
  columnColor,
  isLoading,
  shouldShowDropIndicator,
  setCardsContainerRef,
  onEditCard,
  onDeleteCard,
  onCreateCard,
}: ColumnContentProps) {
  return (
    <CardContent
      className={`pt-4 pb-4 px-3 flex-1 flex flex-col overflow-visible ${columnColor.light}`}
    >
      <div
        ref={setCardsContainerRef}
        className="cards-container flex-1 h-full mt-1 pt-1 overflow-visible"
      >
        {/* Drop indicator for empty column */}
        {(!cards || cards.length === 0) && (
          <DropIndicator
            isVisible={shouldShowDropIndicator?.(columnId, 0) || false}
          />
        )}

        <SortableContext
          items={cards?.map((card) => card.id) || []}
          strategy={verticalListSortingStrategy}
        >
          {cards && cards.length > 0 ? (
            <VirtualizedCardsList
              cards={cards.sort((a, b) => a.order - b.order)}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onClick={onEditCard}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex items-center justify-center h-10 text-gray-400 text-sm">
              No hay tarjetas
            </div>
          )}
        </SortableContext>

        {/* Botón para agregar tarjeta */}
        <div className="pt-3 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent">
          <motion.button
            onClick={onCreateCard}
            disabled={isLoading}
            className="w-full py-3 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 font-medium bg-white/80 backdrop-blur-sm"
            variants={buttonAnimations}
            whileHover="hover"
            whileTap="tap"
          >
            <actionIcons.add className="h-4 w-4" />
            Agregar tarjeta
          </motion.button>
        </div>
      </div>
    </CardContent>
  );
}
