import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IProjectsRepository from '../repositories/IProjectsRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { Response } from 'express';

interface IRequest {
  id: string;
  filename: string;
  response: Response;
}

@injectable()
class ShowAssetToRenderService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ id, filename, response }: IRequest): Promise<void> {
    /*
    SHOW AN ASSET
    */
    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new AppError('No projects found');
    }

    // storage?  disk | fakes3 | s3
    await this.storageProvider.serveImage({
      response,
      file: { project_id: project.id, folder: 'projects', path: project.path },
      fileName: filename
    });
  }
}

export default ShowAssetToRenderService;

// http://localhost:3333/backend/assets/images/render/3e729990-0570-4fa4-9da7-15aba253c0a8?filename=image_produto01_528964206e6b2f2b4ced.png
