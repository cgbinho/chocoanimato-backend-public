import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ShowVideoService from '@modules/projects/services/ShowVideoService';

export default class DownloadsController {
  /*
  SHOW VIDEO
  */
  public async show(request: Request, response: Response): Promise<void> {
    // const id = String(request.query.id); // project_id

    const showVideo = container.resolve(ShowVideoService);

    await showVideo.execute(request, response);
  }
}
