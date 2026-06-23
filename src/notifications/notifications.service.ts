import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crée une notification (appelée par les autres services : like, follow...). */
  async create(params: {
    recipientId: string;
    actorId?: string;
    type: NotificationType;
    entityId?: string;
    content?: string;
  }) {
    return this.prisma.notification.create({ data: params });
    // TODO: pousser aussi en temps réel via une gateway (voir messaging).
  }

  /** Notifications d'un utilisateur, non lues d'abord. */
  async list(recipientId: string) {
    return this.prisma.notification.findMany({
      where: { recipientId },
      orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      take: 50,
      include: {
        actor: { select: { username: true, name: true, avatarUrl: true } },
      },
    });
  }

  async markAllRead(recipientId: string) {
    return this.prisma.notification.updateMany({
      where: { recipientId, read: false },
      data: { read: true },
    });
  }

  async remove(recipientId: string, id: string) {
    return this.prisma.notification.deleteMany({ where: { id, recipientId } });
  }
}
