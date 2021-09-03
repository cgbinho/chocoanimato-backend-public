import { injectable, inject } from 'tsyringe';

import appConfig from '@config/app';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

@injectable()
class ProcessConfirmationEmail {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  queueName(): string {
    return 'ConfirmationMail';
  }

  execute(): void {
    this.queueProvider.process('ConfirmationMail', async job => {
      const { name, email, token, file } = job.data as any;

      await this.mailProvider.sendMail({
        to: {
          name,
          email
        },
        subject: '[Choco Animato] Confirmação de nova conta',
        templateData: {
          file,
          variables: {
            name,
            link: `${appConfig.web_url}/sign-up/confirm?token=${token}`
          }
        }
      });
    });
  }
}

export default ProcessConfirmationEmail;
