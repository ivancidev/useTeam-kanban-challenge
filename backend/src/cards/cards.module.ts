import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { KanbanGateway } from '../kanban/kanban.gateway';

@Module({
  controllers: [CardsController],
  providers: [CardsService, KanbanGateway],
})
export class CardsModule {}
