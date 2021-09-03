import { inject, injectable } from 'tsyringe';

import { v4 as uuidv4 } from 'uuid';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';
import IAuthProvidersRepository from '../repositories/IAuthProvidersRepository';

@injectable()
class CreateUserAdminService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserClassicInfosRepository')
    private userClassicInfosRepository: IUserClassicInfosRepository,
    @inject('AuthProvidersRepository')
    private authProvidersRepository: IAuthProvidersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ name, email, password }): Promise<void> {
    const checkSameEmail = await this.usersRepository.findByEmail(email);

    if (checkSameEmail) {
      console.log('Admin account already created.');
      return;
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.createAdmin({
      name,
      email,
      role: 'admin'
    });
    /*
    CREATE 'classic' AUTH PROVIDER
    */
    await this.authProvidersRepository.create({
      id: uuidv4(),
      type: 'classic',
      user_id: user.id
    })
    /*
    USER TYPE 'classic', SAVE USERCLASSICINFO ON DB.
    */
    await this.userClassicInfosRepository.create({
      user_id: user.id,
      password: hashedPassword,
      is_verified: true
    });

    console.log('User admin created with success.');
  }
}

export default CreateUserAdminService;
