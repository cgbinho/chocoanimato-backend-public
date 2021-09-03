import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ShowCepService from './ShowCepService';
import FakeCepProvider from '../providers/CepProvider/fakes/FakeCepProvider';

let fakeCepProvider: FakeCepProvider;
let showCepService: ShowCepService;

beforeEach(() => {
  fakeCepProvider = new FakeCepProvider();

  showCepService = new ShowCepService(fakeCepProvider);
});

describe('ShowCep', () => {
  it('should be able to show cep information', async () => {
    const cepInfo = await showCepService.execute('03410000');
    expect(cepInfo).toHaveProperty('cep');
  });

  it('should NOT be able to show cep information', async () => {
    await expect(showCepService.execute('000000')).rejects.toBeInstanceOf(
      AppError
    );
  });
});
