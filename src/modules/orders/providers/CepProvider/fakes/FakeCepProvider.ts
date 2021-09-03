import ICepProvider from '../models/ICepProvider';
import AppError from '@shared/errors/AppError';

export default class FakeCepProvider implements ICepProvider {
  public async show(cep: string): Promise<any> {
    if (cep !== '03410000') {
      throw new AppError('Error - Could not get CEP');
    }

    return {
      cep: '03410000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Chácara Santo Antônio (Zona Leste)',
      street: 'Rua Nova Jerusalém',
      service: 'brasilapi'
    };
  }
}
