import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import Project from '@modules/projects/infra/typeorm/entities/Project';
import IProjectsRepository from '../repositories/IProjectsRepository';

import CreateFormFields from '@modules/projects/utils/createFormFields';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  id: string;
}

@injectable()
class DeleteProjectService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ id }: IRequest): Promise<Object> {
    /*
    DELETE A PROJECT
    */
    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new AppError('Project not found.');
    }

    /*
    REMOVE FILES AND FOLDERS
    */
    await this.storageProvider.deleteFolder({
      folder: 'projects',
      path: project.path
    });
    /*
    REMOVE FROM DB
    */
    await this.projectsRepository.delete(project.id);

    return { message: 'Project deleted successfully.' };
  }
}

export default DeleteProjectService;
