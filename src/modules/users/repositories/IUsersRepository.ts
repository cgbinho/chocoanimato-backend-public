import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IIndexUserDTO from '../dtos/IIndexUserDTO';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

export default interface IUsersRepository {
  paginate(data: IIndexUserDTO): Promise<Pagination<User>>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  createAdmin(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  remove(user: User): Promise<User>;
}
