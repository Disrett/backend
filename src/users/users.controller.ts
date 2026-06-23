import { Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // GET /api/users/:username
  @Get(':username')
  getProfile(@Param('username') username: string) {
    return this.users.findByUsername(username);
  }

  // POST /api/users/:id/follow  (protégée)
  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  follow(@CurrentUser() me: { id: string }, @Param('id') targetId: string) {
    return this.users.follow(me.id, targetId);
  }

  // DELETE /api/users/:id/follow  (protégée)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  unfollow(@CurrentUser() me: { id: string }, @Param('id') targetId: string) {
    return this.users.unfollow(me.id, targetId);
  }
}
