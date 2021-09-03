import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import Project from '@modules/projects/infra/typeorm/entities/Project';
import AppError from '@shared/errors/AppError';
import {
  IProjectsRequestDTO,
  IOrdersRequestDTO,
  IUsersRequestDTO,
  IEntitiesRequestDTO
} from '../dtos/IRequestDTO';

/*
MIDDLEWARE TO ALLOW ACCESS TO ENTITY BASED ON OWNERSHIP OR ROLE.
Only the user that created the project and a user with Admin role can view the project
*/

export function setEntity(entity: any, entityName: string) {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = request.user.id;
      const entity_id = request.params.id;

      const usersRepository = getRepository(User);

      const user = await usersRepository.findOne({
        where: { id }
      });

      if (!user) {
        throw new AppError('Not Allowed.');
      }

      const entitiesRepository = getRepository(entity);

      const entityFound = await entitiesRepository.findOne(entity_id);

      if (!entityFound) {
        throw new AppError('Project does not exist.');
      }

      /*
      SETS ENTITY ID AND USER_ID IN REQUEST
       */
      request.user = user;
      request[entityName] = entityFound;

      console.log(`user and ${entityName} is valid through 'setEntity'...`);

      return next();
    } catch {
      console.log(`user and ${entityName} is NOT valid through 'setEntity'...`);
      throw new AppError('Not Allowed', 401);
    }
  };
}

function canViewEntity(user: any, entity: any) {
  return user.role === 'admin' || entity.user_id === user.id;
}

export function ensureCanViewEntity(entityName: string) {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    if (!canViewEntity(request.user, request[entityName])) {
      throw new AppError('Not Allowed', 401);
    }

    return next();
  };
}
