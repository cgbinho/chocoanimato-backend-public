import { container } from 'tsyringe';

import '@modules/users/providers';
import '@modules/orders/providers';
import './providers';

import ITemplatesRepository from '@modules/templates/repositories/ITemplatesRepository';
import TemplatesRepository from '@modules/templates/infra/typeorm/repositories/TemplatesRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IAuthProvidersRepository from '@modules/users/repositories/IAuthProvidersRepository';
import AuthProvidersRepository from '@modules/users/infra/typeorm/repositories/AuthProvidersRepository';

import IUserClassicInfosRepository from '@modules/users/repositories/IUserClassicInfosRepository';
import UserClassicInfosRepository from '@modules/users/infra/typeorm/repositories/UserClassicInfosRepository';

import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import ProjectsRepository from '@modules/projects/infra/typeorm/repositories/ProjectsRepository';

import ICouponsRepository from '@modules/orders/repositories/ICouponsRepository';
import CouponsRepository from '@modules/orders/infra/typeorm/repositories/CouponsRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

container.registerSingleton<ITemplatesRepository>(
  'TemplatesRepository',
  TemplatesRepository
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IAuthProvidersRepository>(
  'AuthProvidersRepository',
  AuthProvidersRepository
);

container.registerSingleton<IUserClassicInfosRepository>(
  'UserClassicInfosRepository',
  UserClassicInfosRepository
);

container.registerSingleton<IProjectsRepository>(
  'ProjectsRepository',
  ProjectsRepository
);

container.registerSingleton<ICouponsRepository>(
  'CouponsRepository',
  CouponsRepository
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository
);

console.log('containers...');
