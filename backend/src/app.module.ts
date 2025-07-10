import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { KanbanGateway } from './kanban/kanban.gateway';

@Module({
  imports: [PrismaModule, BoardsModule, ColumnsModule, CardsModule],
  controllers: [AppController],
  providers: [AppService, KanbanGateway],
})
export class AppModule {}
