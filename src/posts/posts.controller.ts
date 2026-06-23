import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  // GET /api/posts?cursor=...
  @Get()
  feed(@Query('cursor') cursor?: string) {
    return this.posts.feed(cursor);
  }

  // POST /api/posts
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() me: { id: string }, @Body() dto: CreatePostDto) {
    return this.posts.create(me.id, dto);
  }

  // DELETE /api/posts/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@CurrentUser() me: { id: string }, @Param('id') id: string) {
    return this.posts.remove(me.id, id);
  }

  // POST /api/posts/:id/like
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@CurrentUser() me: { id: string }, @Param('id') id: string) {
    return this.posts.like(me.id, id);
  }

  // DELETE /api/posts/:id/like
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@CurrentUser() me: { id: string }, @Param('id') id: string) {
    return this.posts.unlike(me.id, id);
  }

  // POST /api/posts/:id/comments
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  comment(
    @CurrentUser() me: { id: string },
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.posts.addComment(me.id, id, dto);
  }
}
