import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import { IUpdateProjectsDTO } from '@modules/projects/dtos/IUpdateProjectsDTO';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import { getRepository, In, Repository } from 'typeorm';
import Project from '../entities/Project';

class ProjectsRepository implements IProjectsRepository {
  private ormRepository: Repository<Project>;

  constructor() {
    this.ormRepository = getRepository(Project);
  }

  public async paginate({
    user_id,
    page,
    status
  }): Promise<Pagination<Project>> {
    //   /*
    //  QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
    //  */
    const [results, total] = await this.ormRepository.findAndCount({
      where: { user_id, status: status },
      skip: 6 * page,
      take: 6
    });

    return new Pagination<Project>({
      results,
      total
    });
  }

  public async findByIdAndUserId(
    id: string,
    user_id: string
  ): Promise<Project | undefined> {
    const findProject = await this.ormRepository.findOne({ id, user_id });
    return findProject || undefined;
  }

  public async findByUserId(user_id: string): Promise<Project[] | undefined> {
    const findProjects = await this.ormRepository.find({ where: { user_id } });

    return findProjects || undefined;
  }

  public async findById(id: string): Promise<Project | undefined> {
    const findProject = await this.ormRepository.findOne(id);

    return findProject || undefined;
  }

  public async findByIds(ids: string[]): Promise<Project[] | undefined> {
    const projects = await this.ormRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.template', 'template')
      .where('project.id IN (:...ids)', {
        ids
      })
      .getMany();
    // .relation(Template, 'template')

    if (!projects[0]) {
      return null;
    }

    return projects || null;
  }

  public async create(data: ICreateProjectDTO): Promise<Project> {
    const project = this.ormRepository.create(data);

    await this.ormRepository.save(project);

    return project;
  }

  public async update({ ids, columns }: IUpdateProjectsDTO): Promise<any> {
    const projectsUpdated = await this.ormRepository
      .createQueryBuilder('project')
      .update(Project)
      .set(columns)
      .where({ id: In(ids) })
      .execute();

    return projectsUpdated;
  }

  public async save(project: Project): Promise<Project> {
    return this.ormRepository.save(project);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
export default ProjectsRepository;
