import { Response } from 'express';
export interface IServeImageDTO {
  response: Response<any>;
  file: {
    project: any;
    folder: string;
  };
  fileName: string;
}
