import { IServeFileDTO } from '@modules/orders/dtos/IServeFileDTO';
import { IServeImageDTO } from '@modules/projects/dtos/IServeImageDTO';
import { IVideoFilePathDTO } from '@modules/orders/dtos/IVideoFilePathDTO';

export default interface IStorageProvider {
  createProjectFolders(
    template_path: string,
    project_path: string
  ): Promise<void>;
  deleteFolder(data: { folder: string; path: string }): Promise<void>;
  loadJson(file: { folder: string; path: string }): Promise<any>;
  saveJson(file: { folder: string; path: string; data: any }): Promise<void>;
  saveFile(file: {
    folder: string;
    path: string;
    data: any;
    encoding?: string;
  }): Promise<any>;
  deleteFile(file: { folder: string; path: string }): Promise<void>;
  getImagePath(data: {
    folder: string;
    path: string;
    removeImageFromField?: string;
  }): Promise<string>;
  getFilePath(data: IVideoFilePathDTO): Promise<string | null>;
  getFileUrl(data: IVideoFilePathDTO): Promise<string | null>;
  serveFile(data: IServeFileDTO): void;
  uploadFile(data: { folder: string; path: string; data: any }): Promise<any>;
  serveImage(data: IServeImageDTO): Promise<void>;
}
