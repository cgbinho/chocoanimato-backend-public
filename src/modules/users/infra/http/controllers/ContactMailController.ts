import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendContactEmailService from '@modules/users/services/SendContactEmailService';
import ValidateRecaptchaService from '@modules/users/services/ValidateRecaptchaService';

export default class ContactMailController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, message, token } = request.body;

    // Check ReCaptcha if message comes from a human.
    const validateRecaptchaService = container.resolve(
      ValidateRecaptchaService
    );

    const isHuman = await validateRecaptchaService.execute(token);

    // Not human? Get out of here.
    if (!isHuman) {
      return response.status(400).json({
        error: 'Because you are not a human, ReCaptcha rejected your request.'
      });
    }

    const sendContactEmailService = container.resolve(SendContactEmailService);

    await sendContactEmailService.execute({
      name,
      email,
      message,
      token
    });

    return response.status(204).json();
  }
}
