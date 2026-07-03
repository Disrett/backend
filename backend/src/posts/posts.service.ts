import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Fil d'actualité paginé, avec compteurs likes/commentaires. */
  async feed(cursor?: string, take = 20) {
    return this.prisma.post.findMany({
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, name: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async create(authorId: string, dto: CreatePostDto) {
    return this.prisma.post.create({ data: { ...dto, authorId } });
  }

  async remove(authorId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Publication introuvable');
    if (post.authorId !== authorId) {
      throw new NotFoundException('Publication introuvable'); // n'expose pas l'existence
    }
    return this.prisma.post.delete({ where: { id: postId } });
  }

  /** Like idempotent : ne crée pas de doublon grâce à la contrainte unique. */
  async like(userId: string, postId: string) {
    return this.prisma.like.upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    });
  }

  async unlike(userId: string, postId: string) {
    return this.prisma.like
      .delete({ where: { userId_postId: { userId, postId } } })
      .catch(() => ({ success: true })); // déjà absent = ok
  }

  async addComment(authorId: string, postId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: { authorId, postId, content: dto.content },
      include: {
        author: { select: { username: true, name: true, avatarUrl: true } },
      },
    });
  }
}
