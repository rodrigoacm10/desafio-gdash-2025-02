import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from '../../infra/users/mongo/user.schema';
import { USER_REPOSITORY } from '../../domain/users/user.repository';
import { UserMongoRepository } from '../../infra/users/mongo/user-mongo.repository';
import { CreateUserUseCase } from '../../application/users/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../application/users/use-cases/list-users.use-case';
import { GetUserUseCase } from '../../application/users/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../application/users/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/users/use-cases/delete-user.use-case';
import { EnsureDefaultAdminUseCase } from '../../application/users/use-cases/ensure-default-user.use-case';
import { UsersController } from '../../interfaces/users/http/users.controller';

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
  exports: [USER_REPOSITORY, EnsureDefaultAdminUseCase, CreateUserUseCase],
})
export class UsersModule {}
