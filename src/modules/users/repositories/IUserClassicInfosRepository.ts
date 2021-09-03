import UserClassicInfo from '../infra/typeorm/entities/UserClassicInfo';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IIndexUserDTO from '../dtos/IIndexUserDTO';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import ICreateUserClassicInfosDTO from '../dtos/ICreateUserClassicInfosDTO';

export default interface IUserClassicInfosRepository {
  findById(id: string): Promise<UserClassicInfo | undefined>;
  findByUserId(user_id: string): Promise<UserClassicInfo | undefined>;
  create(data: ICreateUserClassicInfosDTO): Promise<UserClassicInfo>;
  save(userClassicInfo: UserClassicInfo): Promise<UserClassicInfo>;
  remove(userClassicInfo: UserClassicInfo): Promise<UserClassicInfo>;
}
