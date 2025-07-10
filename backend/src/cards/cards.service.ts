import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    // Si no se especifica un orden se obtiene el siguiente número disponible
    const nextOrder =
      createCardDto.order ??
      (await this.prisma.card.count({
        where: { columnId: createCardDto.columnId },
      }));

    return await this.prisma.card.create({
      data: {
        title: createCardDto.title,
        description: createCardDto.description,
        order: nextOrder,
        columnId: createCardDto.columnId,
      },
    });
  }

  async findAll() {
    return await this.prisma.card.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.card.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    return await this.prisma.card.update({
      where: { id },
      data: updateCardDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.card.delete({
      where: { id },
    });
  }

  async findByColumn(columnId: string) {
    return await this.prisma.card.findMany({
      where: { columnId },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async moveCard(cardId: string, newColumnId: string, newOrder: number) {
    return await this.prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: newColumnId,
        order: newOrder,
      },
    });
  }
}
