import Order from '@modules/orders/infra/typeorm/entities/Order';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import { IIndexOrderDTO } from '../dtos/IIndexOrderDTO';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

export default interface IOrdersRepository {
  paginate(data: IIndexOrderDTO): Promise<Pagination<Order>>;
  findById(id: string): Promise<Order | undefined>;
  findByTransactionIdAndStatus(
    transaction_id: string,
    status?: string
  ): Promise<Order | undefined>;
  findByIdAndUserId(id: string, user_id: string): Promise<Order | undefined>;
  create(data: ICreateOrderDTO): Promise<Order>;
  save(order: Order): Promise<Order>;
}
