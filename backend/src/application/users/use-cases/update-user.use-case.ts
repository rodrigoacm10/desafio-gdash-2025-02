import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/users/user.repository';
import { User, UserRole } from '../../../domain/users/user.entity';
import * as bcrypt from 'bcrypt';

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const existing = await this.userRepository.findById(input.id);
    if (!existing) throw new NotFoundException('User not found');

    const partial: Partial<User> = {
      name: input.name ?? existing.name,
      email: input.email ?? existing.email,
      role: input.role ?? existing.role,
    };

    if (input.password) {
      partial.passwordHash = await bcrypt.hash(input.password, 10);
    }

    const updated = await this.userRepository.update(input.id, partial);
    if (!updated) throw new NotFoundException('User not found after update');
    return updated;
  }
}
