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
export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = { id: sub, role: undefined };

    console.log('user is valid through ensureAuthenticated...');

    return next();
  } catch {
    console.log('user NOT valid through ensureAuthenticated...');
    throw new AppError('Invalid JWT Token', 401);
  }
}
