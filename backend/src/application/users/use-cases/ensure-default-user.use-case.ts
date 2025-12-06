import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/users/user.repository';
import { CreateUserUseCase } from './create-user.use-case';

@Injectable()
export class EnsureDefaultAdminUseCase {
  private readonly logger = new Logger(EnsureDefaultAdminUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(email: string, password: string, name: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      this.logger.log(`Default admin already exists: ${email}`);
      return;
    }

    this.logger.log(`Creating default admin: ${email}`);

    await this.createUserUseCase.execute({
      email,
      password,
      name,
      role: 'admin',
    });

    this.logger.log('Default admin created successfully');
  }
}
