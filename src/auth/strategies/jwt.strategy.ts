import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string; // id utilisateur
  username: string;
}

/**
 * Valide l'access token envoyé dans le header Authorization: Bearer <token>.
 * Le retour de validate() est injecté dans request.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    // Vérifie la présence du secret avant l'appel à super()
    // (autorisé tant qu'on ne touche pas à `this`).
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      throw new Error('Variable d’environnement JWT_ACCESS_SECRET manquante');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
