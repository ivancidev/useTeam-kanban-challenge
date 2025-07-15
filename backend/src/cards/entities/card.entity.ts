import { Column } from '../../columns/entities/column.entity';

export enum CardPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum CardType {
  TASK = 'TASK',
  BUG = 'BUG',
  ENHANCEMENT = 'ENHANCEMENT',
  FEATURE = 'FEATURE',
  DOCUMENTATION = 'DOCUMENTATION',
  RESEARCH = 'RESEARCH',
}

export class Card {
  id: string;
  title: string;
  description?: string;
  comments?: string;
  dueDate?: Date;
  priority: CardPriority;
  type: CardType;
  tags: string[];
  order: number;
  columnId: string;
  column?: Column;
  createdAt: Date;
  updatedAt: Date;

  // Método estático para transformar datos de Prisma a una instancia de Card
  static fromPrisma(data: any): Card {
    const card = new Card();
    Object.assign(card, {
      ...data,
      priority: data.priority || CardPriority.MEDIUM,
      type: data.type || CardType.TASK,
      tags: data.tags || [],
    });
    return card;
  }
}
