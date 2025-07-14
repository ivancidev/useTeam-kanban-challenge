import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from '../prisma/prisma.service';
import { KanbanGateway } from '../kanban/kanban.gateway';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnsService {
  constructor(
    private prisma: PrismaService,
    private kanbanGateway: KanbanGateway,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    // Si no se especifica un orden se obtiene el siguiente número disponible
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
      include: {
        cards: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Transformamos la respuesta de Prisma a nuestra entidad
    const column = Column.fromPrisma(columnData);

    // Emitir evento WebSocket
    this.kanbanGateway.broadcastColumnCreated(createColumnDto.boardId, column);

    return column;
  }

  async findAll(): Promise<Column[]> {
    const columns = await this.prisma.column.findMany({
      include: {
        cards: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Transformamos cada columna
    return columns.map((column) => Column.fromPrisma(column));
  }

  async findOne(id: string): Promise<Column | null> {
    const column = await this.prisma.column.findUnique({
      where: { id },
      include: {
        cards: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!column) return null;
    return Column.fromPrisma(column);
  }

  async update(id: string, updateColumnDto: UpdateColumnDto): Promise<Column> {
    // Obtener la columna antes de actualizarla para saber el boardId
    const existingColumn = await this.prisma.column.findUnique({
      where: { id },
      select: { boardId: true, order: true },
    });

    // Preparar datos para actualización, preservando order si no se especifica
    const updateData: Partial<UpdateColumnDto> = {
      name: updateColumnDto.name,
    };

    // Solo actualizar order si se especifica explícitamente
    if (updateColumnDto.order !== undefined) {
      updateData.order = updateColumnDto.order;
    }

    const updatedColumn = await this.prisma.column.update({
      where: { id },
      data: updateData,
      include: {
        cards: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    const column = Column.fromPrisma(updatedColumn);

    // Emitir evento WebSocket
    if (existingColumn) {
      this.kanbanGateway.broadcastColumnUpdated(existingColumn.boardId, column);
    }

    return column;
  }

  async remove(id: string): Promise<Column> {
    // Obtener la columna antes de eliminarla para saber el boardId
    const existingColumn = await this.prisma.column.findUnique({
      where: { id },
      select: { boardId: true },
    });

    const deletedColumn = await this.prisma.column.delete({
      where: { id },
    });

    const column = Column.fromPrisma(deletedColumn);

    // Emitir evento WebSocket
    if (existingColumn) {
      this.kanbanGateway.broadcastColumnDeleted(existingColumn.boardId, id);
    }

    return column;
  }

  async findByBoard(boardId: string): Promise<Column[]> {
    const columns = await this.prisma.column.findMany({
      where: { boardId },
      include: {
        cards: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return columns.map((column) => Column.fromPrisma(column));
  }
}
