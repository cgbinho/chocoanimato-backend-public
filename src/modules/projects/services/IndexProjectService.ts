import AppError from '@shared/errors/AppError';

import Project from '@modules/projects/infra/typeorm/entities/Project';
import IProjectsRepository from '../repositories/IProjectsRepository';

import CreateFormFields from '@modules/projects/utils/createFormFields';

import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

import { injectable, inject } from 'tsyringe';

interface IRequest {
  user_id: string;
  status?: string;
  page?: number;
}

@injectable()
class IndexProjectService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({
    user_id,
    page,
    status = 'editing'
  }: IRequest): Promise<Pagination<Project>> {
    /*
     QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
     */

    const projectsExists = await this.projectsRepository.paginate({
      user_id,
      page,
      status
    });

    if (!projectsExists) {
      return new Pagination<Project>({
        results: [],
        total: 0
      });
    }

    //iterate all projects to return parsed data:
    const projects = await Promise.all(
      projectsExists.results.map(async project => {
        /*
        GET FIELD TO CREATE FORM_VALUES
        */
        const { fields, name, ...rest } = project;

        const form_values = await CreateFormFields({
          fields,
          project_name: name
        });

        let response = {
          fields,
          name,
          form_values,
          ...rest
        };
        return response;
      })
    );

    return new Pagination<Project>({
      results: projects,
      total: projectsExists.total
    });
  }
}

export default IndexProjectService;
