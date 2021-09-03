import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRenderService from '@modules/projects/services/CreateRenderService';
import ShowRenderService from '@modules/projects/services/ShowRenderService';

export default class RenderController {
  /*
  CREATE A RENDER
  */
  public async create(request: Request, response: Response): Promise<Response> {
    const project_id = String(request.params.id);
    const user_id = String(request.user.id);

    const createRender = container.resolve(CreateRenderService);

    const render = await createRender.execute({ project_id, user_id });

    return response.json(render);
  }

  /*
  SHOW A RENDER INFO
  */
  public async show(request: Request, response: Response): Promise<Response> {
    const project_id = String(request.params.id);

    const showRender = container.resolve(ShowRenderService);

    const render = await showRender.execute(project_id);

    return response.json(render);
  }
}
