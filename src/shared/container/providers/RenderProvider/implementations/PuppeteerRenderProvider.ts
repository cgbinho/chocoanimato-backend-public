import renderLottie from 'puppeteer-lottie';

import IRenderProvider from '../models/IRenderProvider';
// import ProcessSendForgotPasswordEmailService from '@modules/users/services/ProcessSendForgotPasswordEmailService';
// const jobs = [ProcessSendForgotPasswordEmailService]; // each new job will be included here

class PuppeteerRenderProvider implements IRenderProvider {
  constructor() {}

  /*
  ADD JOB TO THE TOPIC QUEUE
  */
  async create(animationData, output, path, opts): Promise<any> {
    /*
    CREATE RENDER AND SAVE TO OUTPUT
    */
    await renderLottie({ animationData, output });
  }
}

export default PuppeteerRenderProvider;
