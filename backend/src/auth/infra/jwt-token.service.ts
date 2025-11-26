import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../domain/token.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
