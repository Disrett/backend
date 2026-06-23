import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagingService {
  constructor(private readonly prisma: PrismaService) {}

  /** Liste des conversations d'un utilisateur, dernier message d'abord. */
  async conversationsOf(userId: string) {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { updatedAt: 'desc' },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true, name: true, avatarUrl: true } },
          },
        },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  /** Historique paginé d'une conversation. */
  async messages(conversationId: string, cursor?: string, take = 30) {
    return this.prisma.message.findMany({
      where: { conversationId },
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Persiste un message envoyé via WebSocket. */
  async saveMessage(senderId: string, conversationId: string, content: string) {
    const message = await this.prisma.message.create({
      data: { senderId, conversationId, content },
    });
    // Remonte la conversation en tête de liste
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    return message;
  }

  /** Accusé de lecture (double coche). */
  async markRead(conversationId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
