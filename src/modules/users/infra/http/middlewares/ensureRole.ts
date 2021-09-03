import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

/*
MIDDLEWARE TO ALLOW ACCESS BY ROLE 'admin', 'basic', etc.
get('/', ensureRole('admin'), (req,res) => {})
*/
export default function ensureRole(role: string) {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = request.user;

      const usersRepository = getRepository(User);

      const user = await usersRepository.findOne(id);

      if (!user) {
        throw new AppError('Not Allowed.');
      }

      // Checks the user's role
      if (user.role !== role) {
        throw new AppError('Not Allowed.');
      }

      request.user = user;
      console.log(user);

      console.log(`user is valid through 'ensureRole'...`);
      return next();
    } catch {
      console.log(`user NOT valid through 'ensureRole'...`);
      throw new AppError('Not Allowed', 401);
    }
  };
}
