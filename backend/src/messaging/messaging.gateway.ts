import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';

/**
 * Gateway WebSocket de la messagerie temps réel.
 * Gère : connexion/présence, envoi de message, accusés de lecture, "en train d'écrire".
 *
 * Authentification : en production, validez le JWT passé dans
 * socket.handshake.auth.token via un WsJwtGuard avant d'autoriser la connexion.
 */
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messaging: MessagingService) {}

  handleConnection(client: Socket) {
    // TODO: extraire et vérifier le JWT, attacher l'userId au socket,
    // diffuser le statut "en ligne" aux contacts.
    console.log(`Client connecté: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // TODO: diffuser le statut "hors ligne".
    console.log(`Client déconnecté: ${client.id}`);
  }

  /** Rejoindre la "room" d'une conversation pour recevoir ses messages. */
  @SubscribeMessage('conversation:join')
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conv:${data.conversationId}`);
  }

  /** Envoyer un message : persiste puis diffuse à la room. */
  @SubscribeMessage('message:send')
  async onMessage(
    @MessageBody()
    data: { conversationId: string; senderId: string; content: string },
  ) {
    const message = await this.messaging.saveMessage(
      data.senderId,
      data.conversationId,
      data.content,
    );
    this.server
      .to(`conv:${data.conversationId}`)
      .emit('message:new', message);
    return message;
  }

  /** Indicateur "en train d'écrire". */
  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; username: string },
  ) {
    client
      .to(`conv:${data.conversationId}`)
      .emit('typing', { username: data.username });
  }

  /** Accusé de lecture. */
  @SubscribeMessage('message:read')
  async onRead(
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    await this.messaging.markRead(data.conversationId, data.userId);
    this.server
      .to(`conv:${data.conversationId}`)
      .emit('message:read', { userId: data.userId });
  }
}
