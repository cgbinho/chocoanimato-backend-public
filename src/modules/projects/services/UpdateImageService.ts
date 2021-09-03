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

interface Request {
  project: any;
  fields_data: any;
  file?: Express.Multer.File;
}

@injectable()
class UpdateImageService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('ImageTransformProvider')
    private imageTransformProvider: IImageTransformProvider
  ) {}

  public async execute({
    project,
    fields_data,
    file
  }: Request): Promise<string> {
    /*
    CHECK IF IMAGE NEEDS ALPHA THREATMENT
    */
    const { fieldname, filename } = file;

    const isAlphaRequired: boolean =
      fields_data[`${fieldname}_isAlphaRequired`] === 'true' ? true : false;

    const alphaColor: string = fields_data[`${fieldname}_alphaColor`];

    const outputFilename = await createOutputFilename({
      isAlphaRequired,
      file
    });

    /*
      GET IMAGE DIMENSIONS
      */
    const dimensions = await GetImageDimensions({
      fields: project.fields as IFieldsDTO[],
      file
    });
    /*
      CONVERT IMAGE
      */
    const imageConverted = await this.imageTransformProvider.convert({
      input: file,
      dimensions,
      isAlphaRequired,
      alphaColor
    });

    /*
      SAVE CONVERTED IMAGE - DISK OR STORAGE
      */
    await this.storageProvider.saveFile({
      folder: 'projects',
      path: join(`./${project.path}`, 'images', outputFilename),
      data: imageConverted
    });

    /*
    DELETE TEMP IMAGE ( image from temp folder )
    */
    await DeleteFile({
      folder: 'temp',
      path: filename
    });

    // Removes old Image
    const removeOldImageService = container.resolve(RemoveOldImageService);
    await removeOldImageService.execute({ project, fieldname: file.fieldname });

    // Returns new image name:
    return outputFilename;
  }
}

export default UpdateImageService;
