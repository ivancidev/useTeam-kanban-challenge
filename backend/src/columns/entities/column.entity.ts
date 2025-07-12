import { Board } from '../../boards/entities/board.entity';
import { Card } from '../../cards/entities/card.entity';

export class Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
  board?: Board;
  cards?: Card[];
  createdAt: Date;
  updatedAt: Date;

  get totalCards(): number {
    return this.cards?.length || 0;
  }

  static fromPrisma(data: any): Column {
    const column = new Column();
    Object.assign(column, data);

    // Transformar las tarjetas anidadas si existen
    if (data.cards) {
      column.cards = data.cards.map((card) => Card.fromPrisma(card));
    }

    return column;
  }
}
