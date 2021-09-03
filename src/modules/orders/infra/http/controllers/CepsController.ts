import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowCepService from '@modules/orders/services/ShowCepService';

export default class CepsController {
  /*
  SHOW A CEP
  */
  public async show(request: Request, response: Response): Promise<Response> {
    const cep = String(request.query.cep);

    const showCep = container.resolve(ShowCepService);

    const cepInfo = await showCep.execute(cep);
    return response.json(cepInfo);
  }
}
