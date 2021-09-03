import { Request, Response } from 'express';
import { container } from 'tsyringe';
import userView from '../views/responses/users.response';
import ConfirmUserService from '@modules/users/services/ConfirmUserService';

export default class UsersController {
  /*
  CONFIRM USER
  */
  public async update(request: Request, response: Response): Promise<Response> {
    const confirmation_token = String(request.params.confirmation_token);

    const confirmUserService = container.resolve(ConfirmUserService);

    const { token, user } = await confirmUserService.execute({
      confirmation_token
    });

    const userData = userView.render(user);

    // /*
    // RETURNS A SESSION TO AUTOMATIC LOGIN USER.
    // */
    // response.redirect(
    //   302,
    //   `${
    //     process.env.WEB_URL
    //   }/sign-in/callback?token=${token}&user=${JSON.stringify(userData)}`
    // );
    // return response.send();

    return response.status(200).json({ token, user: userData });
  }
}
