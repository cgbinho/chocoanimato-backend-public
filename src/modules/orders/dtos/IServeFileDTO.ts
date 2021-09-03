import { Request, Response } from 'express';
export interface IServeFileDTO {
  request?: Request<any>;
  response: Response<any>;
  file: {
    project_id: string;
    folder: string;
    path: string;
  };
  fileName?: string;
}
