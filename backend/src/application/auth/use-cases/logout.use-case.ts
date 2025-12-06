import { Injectable } from '@nestjs/common';

@Injectable()
export class LogoutUseCase {
  async execute(_refreshToken?: string): Promise<void> {
    return;
  }
}
