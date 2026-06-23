import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  // GET /api/notifications
  @Get()
  list(@CurrentUser() me: { id: string }) {
    return this.notifications.list(me.id);
  }

  // PATCH /api/notifications/read-all
  @Patch('read-all')
  readAll(@CurrentUser() me: { id: string }) {
    return this.notifications.markAllRead(me.id);
  }

  // DELETE /api/notifications/:id
  @Delete(':id')
  remove(@CurrentUser() me: { id: string }, @Param('id') id: string) {
    return this.notifications.remove(me.id, id);
  }
}
