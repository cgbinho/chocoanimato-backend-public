// import { compare, hash } from 'bcryptjs';
import CepPromise from 'cep-promise';
import ICepProvider from '../models/ICepProvider';
import AppError from '@shared/errors/AppError';

export default class CepPromiseProvider implements ICepProvider {
  public async show(cep: string): Promise<any> {
    try {
      const cepInfo = await CepPromise(cep);
      return cepInfo;
    } catch (err) {
      throw new AppError('Error - Could not find Cep Information.');
    }
  }
}
