import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { join } from 'path';
import IProjectsRepository from '../repositories/IProjectsRepository';

import CreateFormFields from '@modules/projects/utils/createFormFields';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  id: string;
}

@injectable()
class ShowProjectService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ id }: IRequest): Promise<Object> {
    /*
    SHOW A PROJECT
    */
    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new AppError('No projects found');
    }

    /*
    DESTRUCTURE SECTIONS, FIELDS TO PARSE STRING STORED IN DB:
    */
    const { fields, ...rest } = project;

    // /* LOAD LOTTIE JSON TO GET FIELDS AND SECTIONS */
    const lottie = await this.storageProvider.loadJson({
      folder: 'projects',
      path: join(`./${project.path}`, 'lottie.json')
    });

    /*
    CREATE FORM_VALUES FIELD
    form_field is a field to populate react-hooks-form @ frontend.
    */
    const form_values = await CreateFormFields({
      fields,
      project_name: project.name
    });

    return {
      fields,
      lottie,
      form_values,
      ...rest
    };
  }
}

export default ShowProjectService;
