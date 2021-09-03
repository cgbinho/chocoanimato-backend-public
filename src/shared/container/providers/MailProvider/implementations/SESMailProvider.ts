import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';
import aws from 'aws-sdk';
// import aws from 'aws-sdk/clients/ses';
import mailConfig from '@config/mail';
import awsConfig from '@config/aws';
import storageConfig from '@config/storage';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES(awsConfig.ses)
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
    attachments
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    console.log(`sending mail to ${to.name}`);
    try {
      const response = await this.client.sendMail({
        from: {
          name: from?.name || name,
          address: from?.email || email
        },
        to: {
          name: to.name,
          address: to.email
        },
        subject,
        html: await this.mailTemplateProvider.parse(templateData),
        attachments
      });
      // console.log('Message sent via SES:');
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}

export default SESMailProvider;
