export type UserRole = 'admin' | 'user';

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface ITokenService {
  signAccess(payload: TokenPayload): Promise<string>;
  signRefresh(payload: TokenPayload): Promise<string>;
  verifyRefresh(token: string): Promise<TokenPayload>;
}

export const TOKEN_SERVICE = 'TOKEN_SERVICE';
