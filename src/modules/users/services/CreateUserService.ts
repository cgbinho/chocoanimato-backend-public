import redisConfig from '@config/redis';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import AppError from '@shared/errors/AppError';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IAuthProvidersRepository from '../repositories/IAuthProvidersRepository';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';
import IUsersRepository from '../repositories/IUsersRepository';
interface IRequest {
  name: string;
  email: string;
  password?: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserClassicInfosRepository')
    private userClassicInfosRepository: IUserClassicInfosRepository,
    @inject('AuthProvidersRepository')
    private authProvidersRepository: IAuthProvidersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider
  ) {}

  public async execute(data: IRequest): Promise<User> {
    const { name, email, password } = data;

    const checkSameEmail = await this.usersRepository.findByEmail(email);

    if (checkSameEmail) {
      throw new AppError('This e-mail is already registered.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      role: 'basic'
    });

    /*
    CREATE 'classic' AUTH PROVIDER
    */
    await this.authProvidersRepository.create({
      id: uuidv4(),
      type: 'classic',
      user_id: user.id
    });
    /*
    SAVE CLASSIC INFO ON DB.
    */
    await this.userClassicInfosRepository.create({
      user_id: user.id,
      password: hashedPassword,
      is_verified: false
    });

    /*
    CREATE CONFIRMATION TOKEN
    */
    // const confirmationToken = crypto.randomBytes(10).toString('hex');
    const confirmationToken = uuidv4();

    // Salva no Redis Chave / Valor de user_id confirmation : token.
    await this.cacheProvider.saveWithExpiration(
      `user-confirmation:${confirmationToken}`,
      user.id,
      redisConfig.token.expiresIn // 24 horas
    );

    // Envia um email para o email de cadastro do usuário
    const confirmationMailTemplate = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'confirm_registration.hbs'
    );

    /*
    QUEUE CONFIRMATION EMAIL
    */
    await this.queueProvider.add('ConfirmationMail', {
      name: user.name,
      email: user.email,
      token: confirmationToken,
      file: confirmationMailTemplate
    });

    return user;
  }
}

export default CreateUserService;
