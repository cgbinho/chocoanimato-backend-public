import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import axios from 'axios';
import authConfig from '@config/auth';

import { google } from 'googleapis';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IAuthProvidersRepository from '../repositories/IAuthProvidersRepository';
import IUserClassicInfosRepository from '../repositories/IUserClassicInfosRepository';

const oAuth2Client = new google.auth.OAuth2({
  clientId: authConfig.google.web.client_id,
  clientSecret: authConfig.google.web.client_secret,
  redirectUri: authConfig.google.web.redirect_uris[0]
});

@injectable()
class CreateGoogleSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserClassicInfosRepository')
    private userClassicInfosRepository: IUserClassicInfosRepository,
    @inject('AuthProvidersRepository')
    private authProvidersRepository: IAuthProvidersRepository
  ) {}

  public async execute(code: string): Promise<any> {
    const { tokens } = await oAuth2Client.getToken(code);

    if (!tokens) {
      throw new AppError('Error getting tokens');
    }

    oAuth2Client.setCredentials(tokens);

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        // `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`
          }
        }
      )
      .then(res => res.data)
      .catch(error => {
        // throw new Error('[GoogleApis] Error getting GoogleUser.');
        throw new AppError('Error! ', error.message);
      });

    const { id, given_name, name, family_name, email } = googleUser;

    let user = await this.usersRepository.findByEmail(email);

    const { secret, expiresIn } = authConfig.jwt;
    /*
    IF USER DOES NOT EXIST, CREATE AND CONNECT WITH AUTH PROVIDERS.
    */

    if (!user) {
      user = await this.usersRepository.create({
        name,
        email,
        role: 'basic'
      });
      /*
     ADD GOOGLE TO AUTHPROVIDER
     */
      await this.authProvidersRepository.create({
        id,
        type: 'google',
        user_id: user.id
      });

      const token = sign({}, secret, {
        subject: user.id,
        expiresIn
      });

      return {
        user,
        token
      };
    }

    /*
    CHECK IF USER HAVE GOOGLE AUTH PROVIDER:
    */
    let googleProvider = await this.authProvidersRepository.findByUserIdAndType(
      user.id,
      'google'
    );

    if (!googleProvider) {
      /*
      ADD GOOGLE TO AUTHPROVIDER
      */
      googleProvider = await this.authProvidersRepository.create({
        id,
        type: 'google',
        user_id: user.id
      });
    }

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    // res.redirect(url);
    return {
      user,
      provider: 'google',
      token
    };
  }
}

export default CreateGoogleSessionService;
