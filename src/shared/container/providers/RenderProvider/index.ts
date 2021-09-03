import { container } from 'tsyringe';

import IRenderProvider from './models/IRenderProvider';

import PuppeteerRenderProvider from './implementations/PuppeteerRenderProvider';

const providers = {
  puppeteer_lottie: PuppeteerRenderProvider
};

container.registerSingleton<IRenderProvider>(
  'RenderProvider',
  providers.puppeteer_lottie
);
