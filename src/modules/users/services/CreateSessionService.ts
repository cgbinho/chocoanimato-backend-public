import authConfig from '@config/auth';
import redisConfig from '@config/redis';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { ICreateSessionsDTO } from '../dtos/ICreateSessionsDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserClassicInfosRepository')
    private userClassicInfosRepository: IUserClassicInfosRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider
  ) {}

  public async execute({
    email,
    password
  }: IRequest): Promise<ICreateSessionsDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email/Password does not match.', 401);
    }
    /*
    GET USER CLASSIC INFO ( password, is_verified, etc.)
    */
    const userClassicInfo = await this.userClassicInfosRepository.findByUserId(
      user.id
    );

    /*
    CHECKS HASHED PASSWORD
    */
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      userClassicInfo.password
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.');
    }

    /*
    CHECK IF USER IS VERIFIED ( ACCOUNT CONFIRMED ), IF NOT, SEND CONFIRMATION EMAIL.
    */
    if (!userClassicInfo.is_verified) {
      console.log('not verified');

      // throw new AppError('User is not verified, verification email sent.');
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

      return { user: null, token: null, provider: null };
      // return null;
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    return {
      user,
      provider: 'classic',
      token
    };
  }
}

export default CreateSessionService;
