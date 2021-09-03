import { Express } from 'express';
import { injectable, inject } from 'tsyringe';

import { join, extname } from 'path';

import IProjectsRepository from '../repositories/IProjectsRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import GetImageNameToDelete from '../utils/getImageNameToDelete';

interface Request {
  project: any;
  fieldname: string;
}

@injectable()
class RemoveOldImageService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ project, fieldname }: Request): Promise<void> {
    /*
      GET OLD IMAGE NAME TO DELETE ( fields, file fieldname)
      */
    const oldImageName = await GetImageNameToDelete({
      fields: project.fields,
      fieldname
    });

    if (oldImageName) {
      /*
      DELETE OLD IMAGE FROM STORAGE
      */
      await this.storageProvider.deleteFile({
        folder: 'projects',
        path: join(`./${project.path}`, 'images', oldImageName)
      });
    }
  }
}

export default RemoveOldImageService;
