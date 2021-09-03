import pagarme from 'pagarme';
import qs from 'qs';
import paymentConfig from '@config/payment';
import appConfig from '@config/app';
import { Request, Response, NextFunction } from 'express';

// CHECKS IF POSTBACK POST REQUEST COMES FROM PAGARME.
export const pagarmeValidatePostback = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // if node_env development and paymentConfig sandbox:
  if (
    paymentConfig.mode === 'sandbox' ||
    appConfig.node_env === 'development'
  ) {
    return next();
  }
  // if production and live:
  const apiKey = paymentConfig.pagarme[paymentConfig.mode].api_key;
  const verifyBody = qs.stringify(request.body);
  const signature = String(request.headers['x-hub-signature']).replace(
    'sha1=',
    ''
  );

  if (!pagarme.postback.verifySignature(apiKey, verifyBody, signature)) {
    return response.json({ error: 'Invalid Postback' });
  }
  return next();
  // return response.json({ message: 'postback válido' });
};
