import CreateOrderService from '@modules/orders/services/Order/CreateOrderService';
import IndexOrderService from '@modules/orders/services/Order/IndexOrderService';
import ShowOrderService from '@modules/orders/services/Order/ShowOrderService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import orderView from '../views/responses/orders.response';

export default class OrdersController {
  /*
 INDEX ALL ORDERS
 */
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = String(request.user.id);
    const page = Number(request.query.page);

    const indexOrders = container.resolve(IndexOrderService);

    const orders = await indexOrders.execute({ user_id, page });

    const orderData = orderView.index(orders);
    return response.json(orderData);
  }

  /*
  SHOW AN ORDER
  */
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showOrder = container.resolve(ShowOrderService);

    const order = await showOrder.execute({ id });

    return response.json(orderView.render(order));
    // return response.json(order);
  }

  /*
  CREATE AN ORDER
  */
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = String(request.user.id);
    /*
    USER PAYMENT DATA
    */
    const data = Object.assign({}, { user_id }, request.body);

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute(data);
    return response.json(orderView.created(order));
  }
}
