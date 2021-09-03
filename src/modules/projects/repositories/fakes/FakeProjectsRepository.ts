import { v4 as uuidv4 } from 'uuid';

import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import IIndexProjectDTO from '@modules/projects/dtos/IIndexProjectDTO';

import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

import Project from '../../infra/typeorm/entities/Project';
import { IUpdateProjectsDTO } from '@modules/projects/dtos/IUpdateProjectsDTO';

class ProjectsRepository implements IProjectsRepository {
  private projects: Project[] = [];

  public async paginate(
    options: IIndexProjectDTO
  ): Promise<Pagination<Project>> {
    //   /*
    //  QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
    //  */
    const findProjects = this.projects;
    const total = findProjects.length;

    return new Pagination<Project>({
      results: findProjects,
      total
    });
  }

  public async findById(id: string): Promise<Project | undefined> {
    const findProject = this.projects.find(project => project.id === id);

    return findProject;
  }

  public async findByIds(ids: string[]): Promise<Project[] | undefined> {
    let mappedProjects: Project[] = [];

    this.projects.forEach(project => {
      ids.forEach(id => {
        if (project.id === id) {
          mappedProjects.push(project);
        }
      });
    });

    return mappedProjects;
  }

  public async findByUserId(user_id: string): Promise<Project[] | undefined> {
    let mappedProjects: Project[] = [];

    mappedProjects = this.projects.filter(
      project => project.user_id === user_id
    );

    return mappedProjects;
  }

  public async findByIdAndUserId(
    id: string,
    user_id: string
  ): Promise<Project | undefined> {
    let project = new Project();

    project = this.projects.find(
      project => project.user_id === user_id && project.id === id
    );
    return project;
  }

  public async create({
    user_id,
    template_id,
    name,
    path,
    status,
    sections,
    fields
  }: ICreateProjectDTO): Promise<Project> {
    const project = new Project();

    Object.assign(
      project,
      { template_id },
      { id: uuidv4() },
      { name },
      { user_id },
      { status },
      { sections },
      { fields },
      { path }
    );

    this.projects.push(project);

    return project;
  }

  public async save(project: Project): Promise<Project> {
    const findIndex = this.projects.findIndex(
      projectItem => projectItem.id === project.id
    );

    this.projects[findIndex] = project;

    return project;
  }

  public async delete(id: string): Promise<void> {
    const projects = this.projects.filter(
      projectToRemove => projectToRemove.id === id
    );
    this.projects = projects;
  }

  public async update({ ids, columns }: IUpdateProjectsDTO): Promise<any> {
    let projectsUpdated = this.projects;
    projectsUpdated.forEach(project => {
      ids.forEach(id => {
        if (project.id === id) {
          project.status = columns.status;
        }
      });
    });
    return projectsUpdated;
  }
}
export default ProjectsRepository;
