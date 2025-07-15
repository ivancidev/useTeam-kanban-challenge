import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly cardInclude = {
    cards: {
      orderBy: { order: 'asc' as const },
    },
  };

  private readonly fullBoardInclude = {
    columns: {
      include: this.cardInclude,
      orderBy: { order: 'asc' as const },
    },
  };

  async create(createBoardDto: CreateBoardDto) {
    return await this.prisma.board.create({
      data: {
        name: createBoardDto.name,
      },
      include: this.fullBoardInclude,
    });
  }

  async findAll() {
    return await this.prisma.board.findMany({
      include: this.fullBoardInclude,
    });
  }

  async findOne(id: string) {
    return await this.prisma.board.findUnique({
      where: { id },
      include: this.fullBoardInclude,
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    return await this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
      include: this.fullBoardInclude,
    });
  }

  async remove(id: string) {
    return await this.prisma.board.delete({
      where: { id },
    });
  }

  async getOrCreateDefaultBoard() {
    let board = await this.prisma.board.findFirst({
      include: this.fullBoardInclude,
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
        include: this.fullBoardInclude,
      });
    }

    return board;
  }
}
