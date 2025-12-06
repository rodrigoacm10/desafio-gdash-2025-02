import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'user';
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();

    if (!request.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (request.user.role !== 'admin') {
      throw new ForbiddenException(
        'Acesso permitido apenas para administradores',
      );
    }

    return true;
  }
}
