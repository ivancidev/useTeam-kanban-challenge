import { Column } from '../../columns/entities/column.entity';

export class Board {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  columns?: Column[];
}
