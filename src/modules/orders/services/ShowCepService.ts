import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import ICepProvider from '../providers/CepProvider/models/ICepProvider';

@injectable()
class ShowCepService {
  constructor(@inject('CepProvider') private cepProvider: ICepProvider) {}

  public async execute(cep: string): Promise<any> {
    /*
    SHOW A CEP INFORMATION
    */
    const cepInfo = await this.cepProvider.show(cep);

    if (!cepInfo) {
      throw new AppError('No Cep information found');
    }

    return cepInfo;
  }
}

export default ShowCepService;
