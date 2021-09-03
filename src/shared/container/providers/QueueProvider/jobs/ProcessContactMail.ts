import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import mailConfig from '@config/mail';

@injectable()
class ProcessContactMail {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  queueName(): string {
    return 'ContactMail';
  }

  execute(): void {
    this.queueProvider.process('ContactMail', async job => {
      const { name, email, message, file } = job.data as any;

      await this.mailProvider.sendMail({
        to: {
          name: mailConfig.defaults.from.name,
          email: mailConfig.defaults.from.email
        },
        subject: `[Choco Animato] Mensagem de ${name} pelo formulário do site.`,
        templateData: {
          file,
          variables: {
            name,
            email,
            message
          }
        }
      });
    });
  }
}

export default ProcessContactMail;
