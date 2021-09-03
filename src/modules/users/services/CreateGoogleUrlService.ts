import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import axios from 'axios';
import authConfig from '@config/auth';

import { google } from 'googleapis';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

const oAuth2Client = new google.auth.OAuth2({
  clientId: authConfig.google.web.client_id,
  clientSecret: authConfig.google.web.client_secret,
  redirectUri: authConfig.google.web.redirect_uris[0]
});

@injectable()
class CreateGoogleUrlService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute(): Promise<string> {
    /*
    CREATES AN OAUTH AUTHENTICATION
    */
    /*
    GET THIS INFORMATION FROM USER
    */
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    /*
    GENERATES THE URL
    */
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
  }
}

export default CreateGoogleUrlService;
