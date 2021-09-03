import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

/*
MIDDLEWARE TO ALLOW ACCESS BY JWT TOKEN.
If user does not have / invalid jwt token it fails.
*/
export default function ensureAuthenticatedByCookies(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  let token: string = '';
  // check for cookies
  if (request?.cookies?.chocoanimatoToken) {
    // const user = JSON.parse(request.cookies.chocoanimatoUser);
    token = request.cookies.chocoanimatoToken;
    // token = user.token;
  }

  // check for auth header:
  if (request?.headers?.authorization) {
    const authHeader = request.headers.authorization;
    const [, authToken] = authHeader.split(' ');
    token = authToken;
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;
    request.user = { id: sub, role: undefined };
    console.log('user is valid through cookies...');
    return next();
  } catch {
    console.log('user NOT valid through cookies...');
    throw new AppError('Invalid JWT Token', 401);
  }

  // request.user = {
  //   id: '2fc7d410-89ad-4abb-bc34-10ae98414929',
  //   role: undefined
  // };
  // return next();

  /*
  {
  provider: 'classic',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDkzNTA1NTYsImV4cCI6MTYwOTk1NTM1Niwic3ViIjoiMmZjN2Q0MTAtODlhZC00YWJiLWJjMzQtMTBhZTk4NDE0OTI5In0.jA00fA8TFoOSkKLeArVHsyiluBupiS4Pc0K5n1htOwY',
  id: '2fc7d410-89ad-4abb-bc34-10ae98414929',
  name: 'Cleber Galves Bordin',
  email: 'cgbinho@gmail.com',
  is_verified: true
  }
  */
}
