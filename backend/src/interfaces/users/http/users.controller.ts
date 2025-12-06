import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/users/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../../application/users/use-cases/list-users.use-case';
import { GetUserUseCase } from '../../../application/users/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../../application/users/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/users/use-cases/delete-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infra/auth/jwt/jwt-auth.guard';
import { AdminGuard } from 'src/infra/auth/jwt/admin.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new user' })
  create(@Body() body: CreateUserDto) {
    return this.createUserUseCase.execute(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lists all users' })
  findAll() {
    return this.listUsersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Finds a user by ID' })
  findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a user' })
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, ...body });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a user' })
  remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
