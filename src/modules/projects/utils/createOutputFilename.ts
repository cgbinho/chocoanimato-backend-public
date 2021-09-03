import crypto from 'crypto';
import { extname } from 'path';

interface IRequest {
  isAlphaRequired: boolean;
  file: Express.Multer.File;
}

export const createOutputFilename = async ({
  isAlphaRequired,
  file
}: IRequest): Promise<string> => {
  /*
  CREATES THE OUTPUT FILE HASH
  */
  const { fieldname, originalname } = file;

  const fileHash = crypto.randomBytes(10).toString('hex');
  /*
  CREATES THE OUTPUT FILE NAME
  */
  const extension = isAlphaRequired
    ? `.png`
    : `${extname(originalname)}`.toLowerCase();

  return `${fieldname}_${fileHash}${extension}`.toLowerCase();
};
