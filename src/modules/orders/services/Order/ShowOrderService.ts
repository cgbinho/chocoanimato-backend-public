import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IOrdersRepository from '../../repositories/IOrdersRepository';

interface IRequest {
  id: string;
}

@injectable()
class ShowOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Object> {
    /*
    SHOW A ORDER
    */
    const order = await this.ordersRepository.findById(id);

    const projects = await this.projectsRepository.findByIds(order.project_ids);

    if (!order) {
      throw new AppError('No orders found');
    }

    return { order, projects };
  }
}

export default ShowOrderService;
