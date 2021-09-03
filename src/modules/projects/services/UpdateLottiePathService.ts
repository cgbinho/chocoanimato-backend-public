import { Express } from 'express';
import { injectable, inject, container } from 'tsyringe';

import { join, extname } from 'path';
import { DeleteFile } from '@shared/container/providers/StorageProvider/lib/FileStates';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IImageTransformProvider from '@shared/container/providers/ImageTransformProvider/models/IImageTransformProvider';

import GetImageDimensions from '../utils/getImageDimensions';

import IFieldsDTO from '../dtos/IFieldsDTO';
import { createOutputFilename } from '../utils/createOutputFilename';
import RemoveOldImageService from './RemoveOldImageService';
import appConfig from '@config/app';

interface Request {
  project_path: string;
}

@injectable()
class UpdateLottiePathService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ project_path }: Request): Promise<void> {
    /*
    UPDATE LOTTIE JSON IMAGES HOST PATH ( development or production ):
    */
    const lottie = await this.storageProvider.loadJson({
      folder: 'projects',
      path: join(`./${project_path}`, 'lottie.json')
    });

    const assetsPathUpdate = lottie.assets.map(asset => {
      asset.u = asset.u.replace(
        `http://localhost:${appConfig.backend_port}`,
        appConfig.backend_url
      );
      return asset;
    });

    const updattedLottie = {
      assets: assetsPathUpdate,
      ...lottie
    };

    /* SAVE UPDATED LOTTIE */
    await this.storageProvider.saveJson({
      folder: 'projects',
      path: join(`./${project_path}`, 'lottie.json'),
      data: updattedLottie
    });
  }
}

export default UpdateLottiePathService;
