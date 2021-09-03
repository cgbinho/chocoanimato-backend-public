import appConfig from '@config/app';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';

@injectable()
class ProcessSendForgotPasswordEmail {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  queueName(): string {
    return 'ForgotPasswordMail';
  }

  execute(): void {
    this.queueProvider.process('ForgotPasswordMail', async job => {
      const { name, email, token } = job.data as any;

      const template = resolve(
        'src',
        'modules',
        'users',
        'views',
        'emails',
        'forgot_password.hbs'
      );

      try {
        await this.mailProvider.sendMail({
          to: {
            name,
            email
          },
          subject: '[Choco Animato] Recuperação de Senha',
          templateData: {
            file: template,
            variables: {
              name,
              link: `${appConfig.web_url}/reset-password?token=${token}`
            }
          }
        });
      } catch (err) {}
    });
  }
}

export default ProcessSendForgotPasswordEmail;
