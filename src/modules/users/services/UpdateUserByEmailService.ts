// import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';

interface IRequestDTO {
  user_email: string;
  name: string;
  email: string;
  password: string;
  role: string;
  is_verified: boolean;
}

@injectable()
export default class UpdateUserByEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserClassicInfosRepository')
    private userClassicInfosRepository: IUserClassicInfosRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_email,
    name,
    email,
    role,
    password,
    is_verified
  }: IRequestDTO): Promise<User> {

    /*
    FIND USER AND UPDATE
    */
    const user = await this.usersRepository.findByEmail(user_email);

    if (!user) {
      throw new AppError('User not found.');
    }

    user.name = name;
    user.role = role;

    /*
    FIND USER CLASSIC INFO AND UPDATE ( password, is_verified, etc.)
    */
    const userClassicInfo = await this.userClassicInfosRepository.findByUserId(user.id);

    userClassicInfo.password = await this.hashProvider.generateHash(password);
    userClassicInfo.is_verified = is_verified;

    await this.userClassicInfosRepository.save(userClassicInfo);

    return await this.usersRepository.save(user);
  }
}
