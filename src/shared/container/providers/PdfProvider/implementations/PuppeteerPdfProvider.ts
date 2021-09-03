import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { resolve } from 'path';
import puppeteer, { PDFOptions } from 'puppeteer';
import { inject, injectable } from 'tsyringe';
import { ICreateReceiptDTO } from '../dtos/ICreateReceiptDTO';
import IPdfProvider from '../models/IPdfProvider';

@injectable()
export default class PuppeteerPdfProvider implements IPdfProvider {
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {}

  public async createReceipt(data: ICreateReceiptDTO): Promise<string> {
    const { projects, order, payment } = data;
    /*
    CREATE A LIST OF ALL ORDER PROJECTS
    */
    const projectList = projects.map((project: ICreateProjectDTO) => ({
      name: project.name,
      description: project.template.description,
      duration: project.template.duration,
      ratio: project.template.ratio,
      price: project.price_formatted
    }));

    // Envia um email para o email de cadastro do usuário
    const file = resolve(
      'src',
      'modules',
      'orders',
      'views',
      'receipt',
      'receipt_test.hbs'
    );

    // D:\ChocoAnimato\Development\backend_v02\src\modules\orders\views\receipt\receipt.hbs

    const templateData = {
      file,
      variables: {
        projects: projectList,
        order: order,
        payment: payment,
        is_multiple_videos: projectList.length > 1 ? true : false
      }
    };

    const htmlPage = await this.mailTemplateProvider.parse(templateData);

    const options: PDFOptions = {
      format: 'A4',
      headerTemplate: '<p></p>',
      footerTemplate: '<p></p>',
      displayHeaderFooter: false,
      margin: {
        top: '40px',
        bottom: '100px'
      },
      printBackground: true
      // path: 'path/to/save/pdf'
    };

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true
    });

    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${htmlPage}`, {
      waitUntil: 'networkidle0'
    });
    const pdfBuffer = await page.pdf(options);
    await browser.close();
    console.log('[PUPPETEER] Pdf buffer created!');
    const bufferBase64 = pdfBuffer.toString('base64');
    return bufferBase64;
  }
}
