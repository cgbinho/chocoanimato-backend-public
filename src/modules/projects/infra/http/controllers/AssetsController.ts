import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { resolve } from 'path';
import ShowAssetService from '@modules/projects/services/ShowAssetService';
import ShowAssetToRenderService from '@modules/projects/services/ShowAssetToRenderService';

export default class AssetsController {
  /*
  SHOW AN ASSET
  */
  public async show(request: Request, response: Response): Promise<void> {
    // const user_id = String(request.user.id);

    const user_id = String(request.user.id);
    const id = String(request.params.id);
    // const filename = String(request.query.filename);
    const filename = String(request.params.filename);

    const showAssets = container.resolve(ShowAssetService);

    await showAssets.execute({ id, user_id, filename, response });
  }

  /*
  SHOW AN ASSET TO RENDER
  */
  public async showToRender(
    request: Request,
    response: Response
  ): Promise<void> {
    // const user_id = String(request.user.id);

    // const user_id = String(request.user.id);
    const id = String(request.params.id);
    // const filename = String(request.query.filename);
    const filename = String(request.params.filename);

    const showAssets = container.resolve(ShowAssetToRenderService);

    await showAssets.execute({ id, filename, response });
  }
}

/*
link para o arquivo:
// http://localhost:3333/backend/assets/images/3e729990-0570-4fa4-9da7-15aba253c0a8?filename=image_produto01_528964206e6b2f2b4ced.png
*/
