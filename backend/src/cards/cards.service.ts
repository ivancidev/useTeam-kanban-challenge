import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { KanbanGateway } from '../kanban/kanban.gateway';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private kanbanGateway: KanbanGateway,
  ) {}

  async create(createCardDto: CreateCardDto) {
    // Si no se especifica un orden se obtiene el siguiente número disponible
    const nextOrder =
      createCardDto.order ??
      (await this.prisma.card.count({
        where: { columnId: createCardDto.columnId },
      }));

    const card = await this.prisma.card.create({
      data: {
        title: createCardDto.title,
        description: createCardDto.description,
        order: nextOrder,
        columnId: createCardDto.columnId,
      },
    });

    // Obtener el boardId de la columna para emitir el evento
    const column = await this.prisma.column.findUnique({
      where: { id: createCardDto.columnId },
      select: { boardId: true },
    });

    // Emitir evento WebSocket
    if (column) {
      this.kanbanGateway.broadcastCardCreated(column.boardId, card);
    }

    return card;
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
    // Obtener información de la tarjeta antes de actualizarla
    const existingCard = await this.prisma.card.findUnique({
      where: { id },
      include: {
        column: {
          select: { boardId: true },
        },
      },
    });

    const updatedCard = await this.prisma.card.update({
      where: { id },
      data: updateCardDto,
    });

    // Emitir evento WebSocket
    if (existingCard?.column) {
      this.kanbanGateway.broadcastCardUpdated(
        existingCard.column.boardId,
        updatedCard,
      );
    }

    return updatedCard;
  }

  async remove(id: string) {
    // Obtener información de la tarjeta antes de eliminarla
    const existingCard = await this.prisma.card.findUnique({
      where: { id },
      include: {
        column: {
          select: { boardId: true },
        },
      },
    });

    const deletedCard = await this.prisma.card.delete({
      where: { id },
    });

    // Emitir evento WebSocket
    if (existingCard?.column) {
      this.kanbanGateway.broadcastCardDeleted(existingCard.column.boardId, id);
    }

    return deletedCard;
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
    // Obtener información de la tarjeta y columnas antes de moverla
    const existingCard = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: {
          select: { boardId: true },
        },
      },
    });

    const updatedCard = await this.prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: newColumnId,
        order: newOrder,
      },
    });

    // Emitir evento WebSocket
    if (existingCard?.column) {
      this.kanbanGateway.broadcastCardMoved(existingCard.column.boardId, {
        cardId,
        targetColumnId: newColumnId,
        newOrder,
      });
    }

    return updatedCard;
  }
}
