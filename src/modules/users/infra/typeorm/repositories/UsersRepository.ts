import { getRepository, Repository, LessThanOrEqual } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import IIndexUserDTO from '@modules/users/dtos/IIndexUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async paginate(options: IIndexUserDTO): Promise<Pagination<User>> {
    const { sort, page, take } = options;
    //   /*
    //  QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
    //  */
    // const queryOptions = Object.assign({}, { is_verified });
    const queryOptions = Object.assign({});

    const [results, total] = await this.ormRepository.findAndCount({
      where: queryOptions,
      relations: ['classic_info', 'auth_providers'],
      order: {
        name: sort
      },
      skip: take * page,
      take: take
    });

    return new Pagination<User>({
      results,
      total
    });
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { id },
      relations: ['auth_providers', 'classic_info']
    });

    return user || null;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
      relations: ['auth_providers', 'classic_info']
    });

    return user || null;
  }

  public async create({ name, email, role }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      role
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async createAdmin({
    name,
    email,
    role
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      role
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async remove(user: User): Promise<User> {
    return this.ormRepository.remove(user);
  }
}
export default UsersRepository;
