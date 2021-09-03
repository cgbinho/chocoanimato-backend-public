import { container } from 'tsyringe';
import storageConfig from '@config/storage';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';
import FakeS3StorageProvider from './implementations/FakeS3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
  fakeS3: FakeS3StorageProvider
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[storageConfig.driver]
);
