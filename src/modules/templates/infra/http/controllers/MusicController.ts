import { Request, Response } from 'express';
import { container } from 'tsyringe';
import IndexMusicService from '@modules/templates/services/IndexMusicService';

export default class MusicController {
  /*
  LIST MUSIC
  */
  public async index(request: Request, response: Response): Promise<Response> {
    const indexMusic = container.resolve(IndexMusicService);

    const music = await indexMusic.execute();

    return response.json(music);
  }
}
