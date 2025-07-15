import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from '../prisma/prisma.service';
import { KanbanGateway } from '../kanban/kanban.gateway';
import { Column } from './entities/column.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColumnsService {
  private readonly orderByAsc = 'asc' as const;

  constructor(
    private prisma: PrismaService,
    private kanbanGateway: KanbanGateway,
  ) {}

  private readonly cardsInclude: Prisma.ColumnInclude = {
    cards: {
      orderBy: { order: this.orderByAsc },
    },
  };

  private readonly columnOrderAsc: Prisma.ColumnOrderByWithRelationInput = {
    order: this.orderByAsc,
  };

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const nextOrder =
      createColumnDto.order ??
      (await this.prisma.column.count({
        where: { boardId: createColumnDto.boardId },
      }));

    const columnData = await this.prisma.column.create({
      data: {
        name: createColumnDto.name,
        order: nextOrder,
        boardId: createColumnDto.boardId,
      },
      include: this.cardsInclude,
    });

    const column = Column.fromPrisma(columnData);

    this.kanbanGateway.broadcastColumnCreated(createColumnDto.boardId, column);
    return column;
  }

  async findAll(): Promise<Column[]> {
    const columns = await this.prisma.column.findMany({
      include: this.cardsInclude,
      orderBy: this.columnOrderAsc,
    });

    return columns.map(Column.fromPrisma);
  }

  async findOne(id: string): Promise<Column | null> {
    const column = await this.prisma.column.findUnique({
      where: { id },
      include: this.cardsInclude,
    });

    return column ? Column.fromPrisma(column) : null;
  }

  async update(id: string, updateColumnDto: UpdateColumnDto): Promise<Column> {
    const existingColumn = await this.prisma.column.findUnique({
      where: { id },
      select: { boardId: true, order: true },
    });

    const updateData: Prisma.ColumnUpdateInput = {
      name: updateColumnDto.name,
    };

    if (updateColumnDto.order !== undefined) {
      updateData.order = updateColumnDto.order;
    }

    const updatedColumn = await this.prisma.column.update({
      where: { id },
      data: updateData,
      include: this.cardsInclude,
    });

    const column = Column.fromPrisma(updatedColumn);

    if (existingColumn) {
      this.kanbanGateway.broadcastColumnUpdated(existingColumn.boardId, column);
    }

    return column;
  }

  async remove(id: string): Promise<Column> {
    const existingColumn = await this.prisma.column.findUnique({
      where: { id },
      select: { boardId: true },
    });

    const deletedColumn = await this.prisma.column.delete({
      where: { id },
    });

    const column = Column.fromPrisma(deletedColumn);

    if (existingColumn) {
      this.kanbanGateway.broadcastColumnDeleted(existingColumn.boardId, id);
    }

    return column;
  }

  async findByBoard(boardId: string): Promise<Column[]> {
    const columns = await this.prisma.column.findMany({
      where: { boardId },
      include: this.cardsInclude,
      orderBy: this.columnOrderAsc,
    });

    return columns.map(Column.fromPrisma);
  }
}
