import type { Response } from 'express';

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // em dev pode deixar false
    sameSite: 'lax', // ou 'strict', depende do fluxo
    path: '/api/auth', // importante por causa do prefixo 'api'
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  });
};
