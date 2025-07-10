import { Column } from '../../columns/entities/column.entity';

export class Card {
  id: string;
  title: string;
  description?: string;
  order: number;
  columnId: string;
  column?: Column;
  createdAt: Date;
  updatedAt: Date;

  // Métodos de lógica de dominio

  // Verifica si la tarjeta se creó recientemente (en las últimas 24 horas)
  isNew(): boolean {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours < 24;
  }

  // Devuelve una versión resumida de la descripción
  getSummary(maxLength: number = 50): string {
    if (!this.description) return '';

    if (this.description.length <= maxLength) {
      return this.description;
    }

    return `${this.description.substring(0, maxLength)}...`;
  }

  // Método estático para transformar datos de Prisma a una instancia de Card
  static fromPrisma(data: any): Card {
    const card = new Card();
    Object.assign(card, data);
    return card;
  }
}
