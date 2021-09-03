import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

import mailConfig from '@config/mail';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    /*
    NODEMAILER DOES NOT WORK IF JOB IS ADDED WHEN QUEUE/RUNNER.TS IS OFF.
    */
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
    attachments
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Choco Animato',
        address: from?.email || 'contato@chocoanimato.com'
      },
      to: {
        name: to.name,
        address: to.email
      },
      bcc: mailConfig.defaults.bcc,
      envelope: {
        from: from?.email || 'contato@chocoanimato.com',
        to: to.email
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
      attachments
    });
    console.log('Message sent: %S', message.messageId);
    console.log('Preview URL: %S', nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;
