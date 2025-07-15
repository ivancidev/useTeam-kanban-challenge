import { CardFormDialog } from "../../../cards/components/CardFormDialog";
import { CardViewEditContainer } from "../../../cards/components/views/CardViewEditContainer";
import { Card, CreateCardDto, UpdateCardDto } from "../../../cards/types";

interface ColumnDialogsProps {
  showCreateCardDialog: boolean;
  onCloseCreateCard: () => void;
  onCreateCard: (data: CreateCardDto) => Promise<void>;
  columnId: string;
  editingCard: Card | null;
  onCloseEditCard: () => void;
  onEditCard: (data: UpdateCardDto) => Promise<void>;
  columnName: string;
  isLoading: boolean;
}

export function ColumnDialogs({
  showCreateCardDialog,
  onCloseCreateCard,
  onCreateCard,
  columnId,
  editingCard,
  onCloseEditCard,
  onEditCard,
  columnName,
  isLoading,
}: ColumnDialogsProps) {
  return (
    <>
      <CardFormDialog
        isOpen={showCreateCardDialog}
        onClose={onCloseCreateCard}
        onSubmit={onCreateCard}
        columnId={columnId}
        isLoading={isLoading}
      />

      {editingCard && (
        <CardViewEditContainer
          isOpen={true}
          onClose={onCloseEditCard}
          card={editingCard}
          onUpdate={onEditCard}
          columnName={columnName}
        />
      )}
    </>
  );
}
