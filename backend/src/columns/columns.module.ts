import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { KanbanGateway } from '../kanban/kanban.gateway';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService, KanbanGateway],
})
export class ColumnsModule {}
