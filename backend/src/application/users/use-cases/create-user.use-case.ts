import { Inject, Injectable, ConflictException } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/users/user.repository';
import { User, type UserRole } from '../../../domain/users/user.entity';
import * as bcrypt from 'bcrypt';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async execute(input: CreateUserInput): Promise<User> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.hashPassword(input.password);

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? 'user',
    });
  }
}
