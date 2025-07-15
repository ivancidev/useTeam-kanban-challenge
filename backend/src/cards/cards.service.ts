import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KanbanGateway } from '../kanban/kanban.gateway';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  private readonly orderByAsc = 'asc' as const;

  constructor(
    private prisma: PrismaService,
    private kanbanGateway: KanbanGateway,
  ) {}

  private async getBoardIdByColumn(columnId: string): Promise<string | null> {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      select: { boardId: true },
    });
    return column?.boardId ?? null;
  }

  private async getBoardIdByCard(cardId: string): Promise<string | null> {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: {
          select: { boardId: true },
        },
      },
    });
    return card?.column?.boardId ?? null;
  }

  async create(createCardDto: CreateCardDto) {
    const nextOrder =
      createCardDto.order ??
      (await this.prisma.card.count({
        where: { columnId: createCardDto.columnId },
      }));

    const card = await this.prisma.card.create({
      data: {
        ...createCardDto,
        dueDate: createCardDto.dueDate ? new Date(createCardDto.dueDate) : null,
        priority: createCardDto.priority || 'MEDIUM',
        type: createCardDto.type || 'TASK',
        order: nextOrder,
      },
    });

    const boardId = await this.getBoardIdByColumn(createCardDto.columnId);
    if (boardId) {
      this.kanbanGateway.broadcastCardCreated(boardId, card);
    }

    return card;
  }

  async findAll() {
    return this.prisma.card.findMany({
      orderBy: {
        order: this.orderByAsc,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.card.findUnique({ where: { id } });
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const boardId = await this.getBoardIdByCard(id);

    const updateData: any = {
      ...updateCardDto,
      dueDate: updateCardDto.dueDate
        ? new Date(updateCardDto.dueDate)
        : undefined,
    };

    const updatedCard = await this.prisma.card.update({
      where: { id },
      data: updateData,
    });

    if (boardId) {
      this.kanbanGateway.broadcastCardUpdated(boardId, updatedCard);
    }

    return updatedCard;
  }

  async remove(id: string) {
    const boardId = await this.getBoardIdByCard(id);

    const deletedCard = await this.prisma.card.delete({ where: { id } });

    if (boardId) {
      this.kanbanGateway.broadcastCardDeleted(boardId, id);
    }

    return deletedCard;
  }

  async findByColumn(columnId: string) {
    return this.prisma.card.findMany({
      where: { columnId },
      orderBy: { order: this.orderByAsc },
    });
  }

  async moveCard(cardId: string, newColumnId: string, newOrder: number) {
    const boardId = await this.getBoardIdByCard(cardId);

    const updatedCard = await this.prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: newColumnId,
        order: newOrder,
      },
    });

    if (boardId) {
      this.kanbanGateway.broadcastCardMoved(boardId, {
        cardId,
        targetColumnId: newColumnId,
        newOrder,
      });
    }

    return updatedCard;
  }
}
