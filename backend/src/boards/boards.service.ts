import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  private readonly boardInclude = {
    columns: {
      include: {
        cards: true,
      },
      orderBy: [
        {
          order: 'asc' as const,
        },
      ],
    },
  };

  private readonly boardIncludeWithCardsOrder = {
    columns: {
      include: {
        cards: {
          orderBy: {
            order: 'asc' as const,
          },
        },
      },
      orderBy: {
        order: 'asc' as const,
      },
    },
  };

  async create(createBoardDto: CreateBoardDto) {
    return await this.prisma.board.create({
      data: {
        name: createBoardDto.name,
      },
      include: this.boardInclude,
    });
  }

  async findAll() {
    return await this.prisma.board.findMany({
      include: this.boardInclude,
    });
  }

  async findOne(id: string) {
    return await this.prisma.board.findUnique({
      where: { id },
      include: this.boardIncludeWithCardsOrder,
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    return await this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
      include: this.boardInclude,
    });
  }
  async remove(id: string) {
    return await this.prisma.board.delete({
      where: { id },
    });
  }

  async getOrCreateDefaultBoard() {
    let board = await this.prisma.board.findFirst({
      include: this.boardIncludeWithCardsOrder,
    });

    if (!board) {
      board = await this.prisma.board.create({
        data: {
          name: 'Mi Tablero Kanban',
          columns: {
            create: [
              { name: 'Por Hacer', order: 0 },
              { name: 'En Progreso', order: 1 },
              { name: 'Completado', order: 2 },
            ],
          },
        },
        include: this.boardIncludeWithCardsOrder,
      });
    }

    return board;
  }
}
