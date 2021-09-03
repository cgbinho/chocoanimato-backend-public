//import 'dotenv/config';
import { injectable, inject, container } from 'tsyringe';

import Project from '@modules/projects/infra/typeorm/entities/Project';
import Template from '@modules/templates/infra/typeorm/entities/Template';

import IProjectsRepository from '../repositories/IProjectsRepository';
import ITemplatesRepository from '@modules/templates/repositories/ITemplatesRepository';

import crypto from 'crypto';
import { resolve, join } from 'path';
import fs from 'fs-extra';

import AppError from '@shared/errors/AppError';

import CreateFormFields from '@modules/projects/utils/createFormFields';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import UpdateLottiePathService from './UpdateLottiePathService';

interface IRequest {
  template_id: string;
  user_id: string;
}

@injectable()
class CreateProjectService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ template_id, user_id }: IRequest): Promise<Object> {
    /*
    GET TEMPLATE BY ID
    */
    const template = await this.templatesRepository.findById(template_id);

    if (!template) {
      throw new AppError('Template does not exist.');
    }
    /*
    CREATE PROJECT FOLDER PATH
    */
    const project_path = crypto.randomBytes(10).toString('hex');

    /*
    CREATE PROJECT FOLDER STRUCTURE
    Based on Template selected
    */
    await this.storageProvider.createProjectFolders(
      template.path,
      project_path
    );

    // /*
    // UPDATE LOTTIE JSON IMAGES HOST PATH ( development or production ):
    // */
    const updateLottiePathService = container.resolve(UpdateLottiePathService);
    await updateLottiePathService.execute({
      project_path
    });

    /*
    LOAD PROJECT JSON TO GET FIELDS AND SECTIONS
    */
    const project_json = await this.storageProvider.loadJson({
      folder: 'projects',
      path: `${project_path}/project.json`
    });

    /*
    CREATE ADDITIONAL PROJECT FIELDS
    form_field is a field to populate react-hooks-form @ frontend.
    */
    const form_values = await CreateFormFields({
      fields: project_json.fields,
      project_name: template.name
    });

    /*
    CREATE AND SAVE A PROJECT
    */
    const createProject = await this.projectsRepository.create({
      template_id,
      user_id,
      name: template.name,
      sections: project_json.sections,
      fields: project_json.fields,
      path: project_path,
      status: 'editing'
    });

    return {
      form_values,
      ...createProject
    };
  }
}

export default CreateProjectService;
