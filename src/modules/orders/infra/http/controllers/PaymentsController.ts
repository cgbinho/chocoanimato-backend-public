import { Request, Response } from 'express';
import { container } from 'tsyringe';
import paymentConfig from '@config/payment';
import PagarmeTransactionStatusUpdateService from '@modules/orders/services/Pagarme/PagarmeTransactionStatusUpdateService';

export default class PaymentsController {
  /*
  POST PAGARME STATUS NOTIFICATION
  */
  public async pagarmeStatusUpdate(
    request: Request,
    response: Response
  ): Promise<any> {
    /*
    UPDATE BUSINESS LOGIC BASED ON TRANSACTION / SUBSCRIPTION /  RECIPIENTS
    CURRENTLY ONLY TRANSACTIONS IS SUPPORTED.
    */
    // object = 'transaction' |  'subscription' | 'recipient';
    const { object } = request.body;

    // If postback is about transactions:
    if (object === 'transaction') {
      const pagarmeStatusUpdate = container.resolve(
        PagarmeTransactionStatusUpdateService
      );

      response.sendStatus(200);
      await pagarmeStatusUpdate.execute(request, response);
      return null;
    }

    response.sendStatus(200);
  }
}
