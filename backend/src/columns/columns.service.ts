import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

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
    return Column.fromPrisma(columnData);
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
    const updatedColumn = await this.prisma.column.update({
      where: { id },
      data: updateColumnDto,
      include: {
        cards: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return Column.fromPrisma(updatedColumn);
  }

  async remove(id: string): Promise<Column> {
    const deletedColumn = await this.prisma.column.delete({
      where: { id },
    });

    return Column.fromPrisma(deletedColumn);
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
