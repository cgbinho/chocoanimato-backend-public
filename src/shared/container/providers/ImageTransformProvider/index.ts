import { container } from 'tsyringe';

import IImageTransformProvider from './models/IImageTransformProvider';

// import SharpProvider from './implementations/SharpProvider';
import JimpProvider from './implementations/JimpProvider';

const providers = {
  // sharp: SharpProvider,
  jimp: JimpProvider
};

container.registerSingleton<IImageTransformProvider>(
  'ImageTransformProvider',
  providers.jimp
);
