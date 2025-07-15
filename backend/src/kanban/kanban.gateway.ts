import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class KanbanGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('KanbanGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-board')
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() boardId: string,
  ) {
    client.join(`board-${boardId}`);
    this.logger.log(`Client ${client.id} joined board ${boardId}`);
  }

  @SubscribeMessage('leave-board')
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() boardId: string,
  ) {
    client.leave(`board-${boardId}`);
    this.logger.log(`Client ${client.id} left board ${boardId}`);
  }

  // Eventos para notificar cambios en tiempo real
  broadcastBoardUpdate(boardId: string, data: any) {
    this.server.to(`board-${boardId}`).emit('board-updated', data);
  }

  broadcastColumnCreated(boardId: string, column: any) {
    this.server.to(`board-${boardId}`).emit('column-created', column);
  }

  broadcastColumnUpdated(boardId: string, column: any) {
    this.server.to(`board-${boardId}`).emit('column-updated', column);
  }

  broadcastColumnDeleted(boardId: string, columnId: string) {
    this.server.to(`board-${boardId}`).emit('column-deleted', { columnId });
  }

  broadcastCardCreated(boardId: string, card: any) {
    this.server.to(`board-${boardId}`).emit('card-created', card);
  }

  broadcastCardUpdated(boardId: string, card: any) {
    this.server.to(`board-${boardId}`).emit('card-updated', card);
  }

  broadcastCardMoved(boardId: string, cardData: any) {
    this.server.to(`board-${boardId}`).emit('card-moved', cardData);
  }

  broadcastCardDeleted(boardId: string, cardId: string) {
    this.server.to(`board-${boardId}`).emit('card-deleted', { cardId });
  }
}
