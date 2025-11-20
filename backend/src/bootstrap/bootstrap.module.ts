import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [UsersModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
