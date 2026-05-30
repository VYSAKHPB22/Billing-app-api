import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'billing-access-secret',
    });
  }

  validate(payload: {
    sub: string;
    shopId: string;
    username: string;
    role: UserRole;
  }) {
    return {
      sub: payload.sub,
      id: payload.sub,
      shopId: payload.shopId,
      username: payload.username,
      role: payload.role,
    };
  }
}
