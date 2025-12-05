import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../users/domain/user.repository';
import {
  type ITokenService,
  TOKEN_SERVICE,
  TokenPayload,
  UserRole,
} from '../../domain/token.service';

export interface RefreshTokensResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokensResult> {
    let payload: TokenPayload;

    try {
      payload = await this.tokenService.verifyRefresh(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newPayload: TokenPayload = {
      sub: user.id!,
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = await this.tokenService.signAccess(newPayload);
    const newRefreshToken = await this.tokenService.signRefresh(newPayload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id!,
        email: user.email,
        role: user.role as UserRole,
        name: user.name,
      },
    };
  }
}
