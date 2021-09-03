import { IVideoFilePathDTO } from '@modules/orders/dtos/IVideoFilePathDTO';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IProjectsRepository from '../repositories/IProjectsRepository';

export interface IRenderStatusDTO {
  step: number; // 1-2
  name: string; // Rendering | Finished
  percentage: number; // 0-100
  is_done: boolean; // true | false
}

@injectable()
class ShowRenderService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute(project_id: string): Promise<any> {
    /*
    SHOW RENDER STATUS
    */

    /* RECOVER RENDER STATUS */
    const previewRenderStatus = await this.cacheProvider.recover<
      IRenderStatusDTO
    >(`preview-render:${project_id}`);

    /* CHECK IF RENDER STATUS EXISTS. */
    if (!previewRenderStatus) {
      throw new AppError('Render does not exist or already expired.');
    }
    /*
    IF RENDER IS DONE, GET THE VIDEO  PATH
    */
    if (previewRenderStatus.is_done) {
      /*
      RECOVER VIDEO FILE - Prefix with preview, so we can get the right video file ( preview in this service's case.)
      */
      const videoFile = await this.cacheProvider.recover<IVideoFilePathDTO>(
        `preview-video-file:${project_id}`
      );
      /*
      IF VIDEO FILE DOES NOT EXIST
      */
      if (!videoFile) {
        throw new AppError('Video file does not exist or already expired.');
      }
      /*
      GET VIDEO PATH
      */
      const url = await this.storageProvider.getFileUrl(videoFile);

      if (!url) {
        throw new AppError('Video path does not exist or already expired.');
      }

      const renderStatusWithPath = Object.assign({}, previewRenderStatus, {
        url
      });
      return renderStatusWithPath;
    }

    const renderStatus = Object.assign({}, previewRenderStatus);
    return renderStatus;
  }
}

export default ShowRenderService;
