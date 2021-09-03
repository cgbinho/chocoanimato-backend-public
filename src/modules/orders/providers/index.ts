import { container } from 'tsyringe';
import CepPromiseProvider from './CepProvider/implementations/CepPromiseProvider';
import ICepProvider from './CepProvider/models/ICepProvider';

container.registerSingleton<ICepProvider>('CepProvider', CepPromiseProvider);
