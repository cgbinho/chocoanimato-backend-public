import Project from '@modules/projects/infra/typeorm/entities/Project';
import ICreateProjectDTO from '../dtos/ICreateProjectDTO';
import IIndexProjectDTO from '../dtos/IIndexProjectDTO';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import { IUpdateProjectsDTO } from '../dtos/IUpdateProjectsDTO';

export default interface IProjectsRepository {
  paginate(data: IIndexProjectDTO): Promise<Pagination<Project>>;
  findById(id: string): Promise<Project | undefined>;
  findByIds(ids: string[]): Promise<Project[] | undefined>;
  findByUserId(user_id: string): Promise<Project[] | undefined>;
  findByIdAndUserId(id: string, user_id: string): Promise<Project | undefined>;
  create(data: ICreateProjectDTO): Promise<Project>;
  save(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
  update({ ids, columns }: IUpdateProjectsDTO): Promise<any>;
}
