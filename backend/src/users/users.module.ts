// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './infra/mongo/user.schema';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserMongoRepository } from './infra/mongo/user-mongo.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { EnsureDefaultAdminUseCase } from './application/use-cases/ensure-default-user.use-case';
import { UsersController } from './interfaces/http/users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserMongoRepository,
    },
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    EnsureDefaultAdminUseCase,
  ],
  exports: [USER_REPOSITORY, EnsureDefaultAdminUseCase],
})
export class UsersModule {}
