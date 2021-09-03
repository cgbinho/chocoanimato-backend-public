import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

// import Queue from '@shared/container/providers/QueueProvider/implementations/BullQueueProvider';

interface IRequest {
  email: string;
}

@injectable()
class ShowUserByEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ email }: IRequest): Promise<any> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('No user found');
    }

    return user;
  }
}

export default ShowUserByEmailService;
