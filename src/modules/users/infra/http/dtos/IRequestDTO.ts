import { Request } from 'express';
import Template from '@modules/templates/infra/typeorm/entities/Template';
import Project from '@modules/projects/infra/typeorm/entities/Project';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import User from '@modules/users/infra/typeorm/entities/User';

export interface IUsersRequestDTO extends Request {
  user: User;
}
export interface IOrdersRequestDTO extends Request {
  order: Order;
}
export interface IProjectsRequestDTO extends Request {
  project: Project;
}

export interface ITemplatesRequestDTO extends Request {
  template: Template;
}

export interface IEntitiesRequestDTO extends Request {
  entity: any;
}
