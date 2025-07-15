import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto) {
    return await this.prisma.board.create({
      data: {
        name: createBoardDto.name,
      },
      include: {
        columns: {
          include: {
            cards: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.board.findMany({
      include: {
        columns: {
          include: {
            cards: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
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
        },
      },
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    return await this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
      include: {
        columns: {
          include: {
            cards: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.board.delete({
      where: { id },
    });
  }

  async getOrCreateDefaultBoard() {
    // Intentar encontrar un board existente
    let board = await this.prisma.board.findFirst({
      include: {
        columns: {
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
        },
      },
    });

    // Si no existe, crear uno nuevo con columnas por defecto
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
        include: {
          columns: {
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
          },
        },
      });
    }

    return board;
  }
}
