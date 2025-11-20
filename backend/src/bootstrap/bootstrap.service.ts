import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnsureDefaultAdminUseCase } from '../users/application/use-cases/ensure-default-user.use-case';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly ensureDefaultAdminUseCase: EnsureDefaultAdminUseCase,
  ) {}

  async onApplicationBootstrap() {
    const email =
      this.config.get<string>('DEFAULT_ADMIN_EMAIL') || 'admin@example.com';
    const password =
      this.config.get<string>('DEFAULT_ADMIN_PASSWORD') || '123456';
    const name = this.config.get<string>('DEFAULT_ADMIN_NAME') || 'Admin';

    this.logger.log('Ensuring default admin user...');
    await this.ensureDefaultAdminUseCase.execute(email, password, name);
    this.logger.log('Default admin user ensured.');
  }
}
