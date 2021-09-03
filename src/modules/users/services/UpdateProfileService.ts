// import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserClassicInfosRepository')
    private userClassicInfosRepository: IUserClassicInfosRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const checkEmail = await this.usersRepository.findByEmail(email);

    /*
    FIND USER CLASSIC INFO AND UPDATE ( password, is_verified, etc.)
    */
    const userClassicInfo = await this.userClassicInfosRepository.findByUserId(
      user.id
    );

    if (!userClassicInfo) {
      throw new AppError('User does not have a classic account.');
    }

    /*
    CHECKS EMAIL
    */
    if (checkEmail && checkEmail.id !== user_id) {
      throw new AppError('This email is already used by another user.');
    }

    /*
    CHECK PASSWORD
    */
    if (password && !old_password) {
      throw new AppError('You need to inform the current password.');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        userClassicInfo.password
      );

      if (!checkOldPassword) {
        throw new AppError('Wrong current password.');
      }

      userClassicInfo.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    await this.userClassicInfosRepository.save(userClassicInfo);

    return await this.usersRepository.save(user);
  }
}
