// import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';
import axios from 'axios';

interface IRequestDTO {
  user_email: string;
  name: string;
  email: string;
  password: string;
  role: string;
  is_verified: boolean;
}

@injectable()
export default class ValidateRecaptchaService {
  constructor() {} // private hashProvider: IHashProvider // @inject('HashProvider') // private userClassicInfosRepository: IUserClassicInfosRepository, // @inject('UserClassicInfosRepository') // private usersRepository: IUsersRepository, // @inject('UsersRepository')

  public async execute(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    // Fetch the user's profile with the access token and bearer
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );

    console.log('recaptcha data: ', data);
    // .catch(error => {
    //   // throw new Error('[GoogleApis] Error getting GoogleUser.');
    //   throw new AppError('Error! ', error.message);
    // });
    return data.success;
  }
}
