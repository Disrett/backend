import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Profil public par username (jamais le passwordHash). */
  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        location: true,
        primarySport: true,
        objectives: true,
        _count: { select: { followers: true, following: true, posts: true } },
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  /** Suivre un utilisateur (idempotent : pas de doublon, pas d'auto-suivi). */
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) return { success: true };
    return this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });
  }

  /** Ne plus suivre (idempotent : ok même si la relation n'existe pas). */
  async unfollow(followerId: string, followingId: string) {
    return this.prisma.follow
      .delete({ where: { followerId_followingId: { followerId, followingId } } })
      .catch(() => ({ success: true }));
  }
}
