import { injectable, inject, container } from 'tsyringe';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import ValidateRecaptchaService from './ValidateRecaptchaService';

interface IRequestDTO {
  name: string;
  email: string;
  message: string;
  token: string;
}

@injectable()
class SendContactEmailService {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider
  ) {}

  public async execute({
    name,
    email,
    message,
    token
  }: IRequestDTO): Promise<void> {
    const contactEmailTemplate = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'contact.hbs'
    );

    await this.queueProvider.add('ContactMail', {
      name,
      email,
      message,
      file: contactEmailTemplate
    });
  }
}

export default SendContactEmailService;
