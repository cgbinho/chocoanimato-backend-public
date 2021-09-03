import { resolve } from 'path';
import express, { Request, Response, NextFunction, Router } from 'express';
import storageConfig from '@config/storage';
import { join } from 'path';
const publicRoutes = Router();

// Set public files of disk, fakeS3 or S3:
const isS3 = storageConfig.driver === 's3' ? true : false;

// if not S3, we serve the disk files from disk:
if (!isS3) {
  /*
  DISK PUBLIC
  */
  publicRoutes.use('/music', express.static(storageConfig.disk.public.music));

  publicRoutes.use('/images', express.static(storageConfig.disk.public.images));

  publicRoutes.use(
    '/templates',
    express.static(storageConfig.disk.public.templates)
  );

  // publicRoutes.use(
  //   '/music',
  //   express.static(resolve(storageConfig.disk.public.music, 'samples'))
  // );
}

export default publicRoutes;
