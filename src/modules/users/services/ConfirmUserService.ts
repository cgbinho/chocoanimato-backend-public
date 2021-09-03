import authConfig from '@config/auth';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
// import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  confirmation_token: string;
}

@injectable()
class ConfirmUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserClassicInfosRepository')
    private userClassicInfosRepository: IUserClassicInfosRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ confirmation_token }: IRequestDTO): Promise<any> {
    /*
    RECOVER TOKEN FROM CACHE
    */
    const user_id = await this.cacheProvider.recover<string>(
      `user-confirmation:${confirmation_token}`
    );
    /*
    CHECK IF TOKEN EXISTS.
    */
    if (!user_id) {
      throw new AppError('Token or User does not exist.');
    }
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist.');
    }
    /*
    GET AND UPDATE USER
    */
    const userClassicInfo = await this.userClassicInfosRepository.findByUserId(
      user.id
    );

    if (!userClassicInfo) {
      throw new AppError('Token or User does not exist.');
    }

    userClassicInfo.is_verified = true;

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    /*
    REMOVE KEY FROM REDIS ( no need to keep this verification key ).
    */
    await this.cacheProvider.invalidate(`user-confirmation:${token}`);

    /*
    SAVE CLASSIC INFO AND UPDATE USER.
    */
    await this.userClassicInfosRepository.save(userClassicInfo);
    const updatedUser = await this.usersRepository.findById(user_id);

    return {
      user: { ...updatedUser, provider: 'classic' },
      token
    };
  }
}

export default ConfirmUserService;
