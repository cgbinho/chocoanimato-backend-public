import { container } from 'tsyringe';

import IVideoConverterProvider from './models/IVideoConverterProvider';

import FfmpegProvider from './implementations/FfmpegProvider';

const providers = {
  ffmpeg: FfmpegProvider
};

container.registerSingleton<IVideoConverterProvider>(
  'VideoConverterProvider',
  providers.ffmpeg
);
