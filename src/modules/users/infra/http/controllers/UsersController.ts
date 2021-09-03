import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserByEmailService from '@modules/users/services/DeleteUserByEmailService';
import IndexUserService from '@modules/users/services/IndexUserService';
import ShowUserByEmailService from '@modules/users/services/ShowUserByEmailService';
import UpdateUserByEmailService from '@modules/users/services/UpdateUserByEmailService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  /*
  CREATE A USER
  */
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password
    });

    return response.json(user);
  }
  /*
  ADMIN
  */
  /*
  INDEX ALL USERS
  */
  public async index(request: Request, response: Response): Promise<Response> {
    const { sort, page, take } = request.query;
    const indexUsers = container.resolve(IndexUserService);

    const users = await indexUsers.execute({
      page,
      sort,
      take
    });

    return response.json(users);
  }

  public async showByEmail(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { email } = request.params;

    const createUser = container.resolve(ShowUserByEmailService);

    const user = await createUser.execute({
      email
    });

    return response.json(user);
  }

  public async updateByEmail(
    request: Request,
    response: Response
  ): Promise<Response> {
    // decodeURIComponent();
    const user_email = request.params.email;
    const { name, email, password, is_verified, role } = request.body;

    const updateProfile = container.resolve(UpdateUserByEmailService);

    const user = await updateProfile.execute({
      user_email,
      name,
      email,
      password,
      role,
      is_verified
    });

    return response.json(user);
  }

  public async deleteByEmail(
    request: Request,
    response: Response
  ): Promise<Response> {
    // decodeURIComponent();
    const { email } = request.params;

    const updateProfile = container.resolve(DeleteUserByEmailService);

    const user = await updateProfile.execute({
      email
    });

    return response.json({ message: 'User Deleted.' });
  }
}
