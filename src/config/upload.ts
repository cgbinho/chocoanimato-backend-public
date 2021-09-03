import AppError from '@shared/errors/AppError';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import { extname, resolve } from 'path';
import storageConfig from '@config/storage';

const tmpFolder = storageConfig.disk.private.temp;
// resolve(__dirname, '..', '..', 'storage', 'disk', 'temp');

interface IUploadConfig {
  driver: 's3' | 'disk' | 'fakeS3';

  tmpFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');

        const fileName = `${fileHash}_${file.fieldname}_${extname(
          file.originalname
        )}`.toLowerCase();

        return callback(null, fileName);
      }
    }),
    fileFilter: (request, file, callback) => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
        // "image/gif"
      ];

      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new AppError('Invalid file type.'));
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 2 // 2mb
    }
  },
  config: {
    disk: {},
    aws: {
      bucket: process.env.AWS_S3_PRIVATE_PROJECTS
    }
  }
} as IUploadConfig;

/*
onFileSizeLimit: file => {
  // but res (response) object is not existing here
  file.error = {
    message: 'Upload failed',
    status: 'File too large.'
    // status: -6
  };
},
onFileUploadComplete: (file, req, res) => {
  if (file.error) {
    res.send(file.error);
  }
}
*/
// limits: {
//   fileSize: 2 * 1024 * 1024
// },
// fileFilter: (req, file, cb) => {
//   const allowedMimes = [
//     "image/jpeg",
//     "image/pjpeg",
//     "image/png"
//     // "image/gif"
//   ];

//   if (allowedMimes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type."));
//   }
// }
