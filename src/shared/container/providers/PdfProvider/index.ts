import { container } from 'tsyringe';

import IPdfProvider from './models/IPdfProvider';
import pdfConfig from '@config/pdf';
// import SharpProvider from './implementations/SharpProvider';
import PdfkitProvider from './implementations/PdfkitProvider';
import PuppeteerPdfProvider from './implementations/PuppeteerPdfProvider';

const providers = {
  pdfkit: PdfkitProvider,
  puppeteer: PuppeteerPdfProvider
};

container.registerSingleton<IPdfProvider>(
  'PdfProvider',
  providers[pdfConfig.driver]
);
