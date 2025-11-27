// backend/src/auth/application/use-cases/login.use-case.ts
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = {
      sub: user.id!,
      email: user.email,
      role: user.role as UserRole, // cast aqui, se o User.role ainda for string
    };

    const accessToken = await this.tokenService.signAccess(payload);
    const refreshToken = await this.tokenService.signRefresh(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
      },
    };
  }
}
