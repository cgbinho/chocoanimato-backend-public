import redisConfig from '@config/redis';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import AppError from '@shared/errors/AppError';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    /*
    CREATE RESET-PASSWORD TOKEN
    */
    const token = uuidv4();

    /*
    SAVE TOKEN TO REDIS TO EXPIRE
    */
    await this.cacheProvider.saveWithExpiration(
      `reset-password:${token}`,
      user.id,
      // 60 * 60 * 24 // 24 horas
      redisConfig.token.expiresIn // 24 horas
    );

    const forgotPasswordTemplate = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'forgot_password.hbs'
    );

    await this.queueProvider.add('ForgotPasswordMail', {
      name: user.name,
      email: user.email,
      token,
      file: forgotPasswordTemplate
    });
  }
}

export default SendForgotPasswordEmailService;
