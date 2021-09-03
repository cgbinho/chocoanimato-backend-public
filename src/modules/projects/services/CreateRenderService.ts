import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
// import { join, resolve } from 'path';
// import fs from 'fs-extra';
// import crypto from 'crypto';

// import Project from '@modules/projects/infra/typeorm/entities/Project';
import IProjectsRepository from '../repositories/IProjectsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IRenderProvider from '@shared/container/providers/RenderProvider/models/IRenderProvider';
import IVideoConverterProvider from '@shared/container/providers/VideoConverterProvider/models/IVideoConverterProvider';

interface IRequest {
  project_id: string;
  user_id: string;
}

@injectable()
class CreateRenderService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('RenderProvider')
    private renderProvider: IRenderProvider,
    @inject('VideoConverterProvider')
    private videoConverterProvider: IVideoConverterProvider
  ) {}

  public async execute({ project_id, user_id }: IRequest): Promise<Object> {
    /*
    CREATE A RENDER
    */
    // const project = await this.projectsRepository.findById(project_id);
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new AppError('Project not found');
    }

    /*
    QUEUE RENDER VIDEO PROCESS
    */
    const process = await this.queueProvider.add('RenderVideo', {
      project: {
        id: project.id,
        name: project.name,
        path: project.path,
        fields: project.fields,
        duration: project.template.duration
      }
    });

    return process;
  }
}

export default CreateRenderService;
