import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IAuthProvidersRepository from '../repositories/IAuthProvidersRepository';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
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
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    /*
    RECOVER TOKEN FROM CACHE
    */
    const user_id = await this.cacheProvider.recover<string>(
      `reset-password:${token}`
    );

    if (!user_id) {
      throw new AppError('Token is invalid or already invalidated.');
    }

    /*
    UPDATE USER WITH NEW PASSWORD
    */
    // const user = await this.usersRepository.findById(user_id);

    // if (!user) {
    //   throw new AppError('Token or User does not exist.');
    // }

    /*
    GET USER CLASSIC INFO ( password, is_verified, etc.)
    */
    const userClassicInfo = await this.userClassicInfosRepository.findByUserId(
      user_id
    );

    userClassicInfo.password = await this.hashProvider.generateHash(password);

    /*
    REMOVE KEY FROM REDIS ( no need to keep this verification key ).
    */
    await this.cacheProvider.invalidate(`reset-password:${token}`);

    // await this.usersRepository.save(user);
    await this.userClassicInfosRepository.save(userClassicInfo);
  }
}

export default ResetPasswordService;
