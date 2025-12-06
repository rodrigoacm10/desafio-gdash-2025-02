import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BootstrapService } from 'src/application/bootstrap/services/bootstrap.service';

@Module({
  imports: [UsersModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
