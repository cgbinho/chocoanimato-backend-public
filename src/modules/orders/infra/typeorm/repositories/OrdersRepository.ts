import { getRepository, Repository, LessThanOrEqual, In } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import { IUpdateOrdersDTO } from '@modules/orders/dtos/IUpdateOrdersDTO';

import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

import Order from '../entities/Order';

interface IIndexOrderDTO {
  user_id: string;
  status: string;
  sort: 'ASC' | 'DESC' | 1 | -1;
  take: number;
  page: number;
}
class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async paginate(data: IIndexOrderDTO): Promise<Pagination<Order>> {
    const { user_id, status, sort = 'DESC', take = 20, page = 0 } = data;
    //   /*
    //  QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
    //  */

    const queryOptions = Object.assign({}, { user_id }, status && { status });

    const [results, total] = await this.ormRepository.findAndCount({
      where: queryOptions,
      order: {
        created_at: sort
      },
      skip: take * page,
      take: take
    });

    return new Pagination<Order>({
      results,
      total
    });
  }

  public async findByIdAndUserId(
    id: string,
    user_id: string
  ): Promise<Order | undefined> {
    const findOrder = await this.ormRepository.findOne({
      where: { id, user_id }
    });

    return findOrder || null;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const findOrder = await this.ormRepository.findOne(id);

    return findOrder || null;
  }

  public async findByTransactionIdAndStatus(
    transaction_id: string,
    status?: string
  ): Promise<Order | undefined> {
    const queryOptions = Object.assign(
      {},
      { transaction_id },
      status ? { status } : {}
    );

    const findOrder = await this.ormRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email'])
      .where(queryOptions)
      .getOne();

    return findOrder || null;
  }

  public async create(data: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create(data as object);

    await this.ormRepository.save(order);

    return order;
  }

  public async save(order: Order): Promise<Order> {
    return this.ormRepository.save(order);
  }

  public async update({ ids, columns }: IUpdateOrdersDTO): Promise<any> {
    const projectsUpdated = await this.ormRepository
      .createQueryBuilder('order')
      .update(Order)
      .set(columns)
      .where({ id: In(ids) })
      .execute();

    return projectsUpdated;
  }
}
export default OrdersRepository;
