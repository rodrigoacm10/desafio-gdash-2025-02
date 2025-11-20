export interface ITokenService {
  sign(payload: any): Promise<string> | string;
}

export const TOKEN_SERVICE = 'TOKEN_SERVICE';
