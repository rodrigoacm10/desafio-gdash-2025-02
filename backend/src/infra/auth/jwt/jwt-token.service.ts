import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import {
  ITokenService,
  TokenPayload,
} from '../../../domain/auth/token.service';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signAccess(payload: TokenPayload): Promise<string> {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async signRefresh(payload: TokenPayload): Promise<string> {
    const secret =
      this.config.get<string>('JWT_REFRESH_SECRET') ?? 'changeme-refresh';
    const expiresIn = this.config.get('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    return token;
  }

  async verifyRefresh(token: string): Promise<TokenPayload> {
    const secret =
      this.config.get<string>('JWT_REFRESH_SECRET') ?? 'changeme-refresh';

    const payload = this.jwtService.verify<TokenPayload>(token, {
      secret,
    });

    return payload;
  }
}
