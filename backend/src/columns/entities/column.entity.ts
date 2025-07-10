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

  // Método para calcular el número total de tarjetas
  get totalCards(): number {
    return this.cards?.length || 0;
  }

  // Método estático para transformar datos de Prisma a una instancia de Column
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
