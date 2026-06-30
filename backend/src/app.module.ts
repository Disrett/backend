import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Charge les variables d'environnement (.env) globalement
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    MessagingModule,
    NotificationsModule,
    // À ajouter au fur et à mesure (même patron que PostsModule) :
    // CommentsModule, SportsModule, GroupsModule, EventsModule, ChallengesModule
  ],
})
export class AppModule {}
