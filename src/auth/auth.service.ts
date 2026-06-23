import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** Inscription : crée l'utilisateur avec un mot de passe haché (argon2). */
  async register(dto: RegisterDto) {
    // Vérifie l'unicité email + username
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException('Email ou nom d’utilisateur déjà utilisé');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        name: dto.name,
        passwordHash,
      },
    });

    return this.issueTokens(user.id, user.username);
  }

  /** Connexion : vérifie l'email puis le mot de passe. */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // Message volontairement générique pour ne pas révéler si l'email existe
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    return this.issueTokens(user.id, user.username);
  }

  /** Renouvelle l'access token à partir d'un refresh token valide. */
  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Accès refusé');
    }
    const matches = await argon2.verify(user.hashedRefreshToken, refreshToken);
    if (!matches) throw new UnauthorizedException('Accès refusé');

    return this.issueTokens(user.id, user.username);
  }

  /** Déconnexion : invalide le refresh token stocké. */
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
    return { success: true };
  }

  /** Génère access + refresh token et stocke le hash du refresh en base. */
  private async issueTokens(userId: string, username: string) {
    const payload = { sub: userId, username };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      } as JwtSignOptions),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
      } as JwtSignOptions),
    ]);

    // Rotation : on stocke le hash du refresh token courant
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: await argon2.hash(refreshToken) },
    });

    return { accessToken, refreshToken };
  }
}
