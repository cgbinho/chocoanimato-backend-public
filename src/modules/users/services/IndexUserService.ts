import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import IIndexUserDTO from '../dtos/IIndexUserDTO';
import User from '../infra/typeorm/entities/User';

@injectable()
class IndexUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(data: IIndexUserDTO): Promise<Pagination<User>> {
    /*
     QUERY FILTERS: SORT ( ASC, DESC ) & PAGE.
     */
    const { page = 0, sort = 'DESC', take = 20 } = data;

    const users = await this.usersRepository.paginate({
      page,
      sort,
      take
    });

    return new Pagination<User>({
      results: users.results,
      total: users.total
    });
  }
}

export default IndexUserService;
