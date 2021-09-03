import CreateGoogleSessionService from '@modules/users/services/CreateGoogleSessionService';
import CreateGoogleUrlService from '@modules/users/services/CreateGoogleUrlService';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import userView from '../views/responses/users.response';
import appConfig from '@config/app';
export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;

      const authenticateUser = container.resolve(CreateSessionService);

      const { user, token, provider } = await authenticateUser.execute({
        email,
        password
      });
      if (!user && !token && !provider) {
        throw new AppError(
          'Você precisa confirmar sua conta antes de fazer login ( Um email de confirmação foi enviado para você ).'
        );
      }

      return response.json({ user: userView.render(user), token, provider });
    } catch (err) {
      throw new AppError(err.message);
      // return response.status(400).json({ error: err.message });
    }
  }

  public async createGoogleSession(
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const code = String(request.query.code);

      const createGoogleSessionService = container.resolve(
        CreateGoogleSessionService
      );

      const {
        user,
        token,
        provider
      } = await createGoogleSessionService.execute(code);

      const userData = { provider, ...userView.render(user) };

      response.redirect(
        302,
        `${
          appConfig.web_url
        }/sign-in/callback?token=${token}&user=${JSON.stringify(userData)}`
      );
      return response.send();

      // return response.json({ user: userView.render(user), token, provider });
    } catch (err) {
      throw new AppError(err.message);
      // return response.status(400).json({ error: err.message });
    }
  }

  public async createGoogleUrl(
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const createGoogleUrlService = container.resolve(CreateGoogleUrlService);

      const url = await createGoogleUrlService.execute();

      return response.status(200).send({ url });
    } catch (err) {
      throw new AppError(err.message);
      // return response.status(400).json({ error: err.message });
    }
  }
}
