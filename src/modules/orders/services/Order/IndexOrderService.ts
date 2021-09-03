import Order from '@modules/orders/infra/typeorm/entities/Order';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import { inject, injectable } from 'tsyringe';
import { IIndexOrderDTO } from '../../dtos/IIndexOrderDTO';
import IOrdersRepository from '../../repositories/IOrdersRepository';

@injectable()
class IndexOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository
  ) {}

  public async execute(data: IIndexOrderDTO): Promise<Pagination<Order>> {
    /*
     QUERY FILTERS: SORT ( ASC, DESC ) & PAGE.
     */
    const { user_id, page, sort, status, take } = data;

    /*
     QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
     */
    const { results, total } = await this.ordersRepository.paginate({
      user_id,
      status,
      sort,
      take,
      page
    });

    // //iterate all orders to return parsed data:
    // const orders = await Promise.all(
    //   ordersExists.results.map(async order => {
    //     return order;
    //   })
    // );

    return new Pagination<Order>({
      results,
      total
    });
  }
}

export default IndexOrderService;
