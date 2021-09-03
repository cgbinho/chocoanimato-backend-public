//import 'dotenv/config';

interface IPdfConfig {
  driver: 'puppeteer' | 'pdfkit';
}

export default {
  driver: process.env.PDF_DRIVER || 'puppeteer'
} as IPdfConfig;
