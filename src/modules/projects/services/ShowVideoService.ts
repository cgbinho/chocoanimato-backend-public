// import IOrdersRepository from '../repositories/IOrdersRepository';
import { IVideoFilePathDTO } from '@modules/orders/dtos/IVideoFilePathDTO';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

@injectable()
class ShowVideoService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute(request: Request, response: Response): Promise<void> {
    /*
    SHOW A VIDEO
    */
    const id = String(request.params.id); // project_id
    const type = String(request.params.type); // type: 'preview' or 'delivery'

    /* RECOVER VIDEOFILE NAME CACHE */
    const videoFilePathObject = await this.cacheProvider.recover<
      IVideoFilePathDTO
    >(`${type}-video-file:${id}`);

    // testing purposes:
    // const videoFilePathObject = {
    //   project_id: '3e729990-0570-4fa4-9da7-15aba253c0a8',
    //   name: 'Projeto Teste',
    //   folder: 'downloads',
    //   path: 'ChocoAnimato_preview_dded3cf80cbbdbaa8323_video_copy.mp4',
    //   type: 'preview'
    // };

    /* CHECK IF VIDEO FILE CACHE EXISTS. */
    if (!videoFilePathObject) {
      throw new AppError('File does not exist or already expired.');
    }

    /*
    GENERATE RANDOM NAME
    */
    const fileName = `ChocoAnimato_video_${uuidv4()}.mp4`;
    // console.log({ videoFilePathObject });
    /*
    LOAD VIDEO FILE FROM DISK OR S3
    */
    this.storageProvider.serveFile({
      request,
      response,
      file: videoFilePathObject,
      fileName
    });
  }
}

export default ShowVideoService;
