import IStorageProvider from '../models/IStorageProvider';
import appConfig from '@config/app';
import storageConfig from '@config/storage';
import { join } from 'path';
import { IVideoFilePathDTO } from '@modules/orders/dtos/IVideoFilePathDTO';
import { IServeFileDTO } from '@modules/orders/dtos/IServeFileDTO';
import { IServeImageDTO } from '@modules/projects/dtos/IServeImageDTO';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async createProjectFolders(
    template_path: string,
    project_path: string
  ): Promise<void> {
    this.storage.push(project_path);
  }

  public async deleteFolder(data: {
    folder: string;
    path: string;
  }): Promise<void> {
    const { folder, path } = data;

    const fullPath = `${folder}/${path}`;

    const findIndex = this.storage.findIndex(
      storageFile => storageFile === fullPath
    );

    this.storage.splice(findIndex, 1);
  }

  public async loadJson(data: { folder: string; path: string }): Promise<any> {
    const { folder, path } = data;
    const fullPath = `${folder}/${path}`;

    return fullPath;
  }

  public async saveJson(file: {
    folder: string;
    path: string;
    data: any;
  }): Promise<void> {
    const { folder, path, data } = file;
    const fullPath = `${folder}/${path}/${data}`;
    this.storage.push(fullPath);
  }

  public async saveFile(file: {
    folder: string;
    path: string;
    data: any;
    encoding?: string;
  }): Promise<string> {
    const { folder, path, data } = file;
    const fullPath = `${folder}/${path}/${data}`;
    this.storage.push(fullPath);

    return fullPath;
  }

  public async deleteFile(file: {
    folder: string;
    path: string;
  }): Promise<void> {
    const { folder, path } = file;
    // this.storage = this.storage.filter(fileToFilter => fileToFilter !== file);
    const findIndex = this.storage.findIndex(
      storageFile => storageFile === `${folder}/${path}`
    );

    this.storage.splice(findIndex, 1);
  }

  public async getImagePath(data: {
    folder: string;
    path: string;
  }): Promise<string> {
    const { folder, path } = data;
    /*
    GET THE RELATIVE PATH TO SET LOTTIE IMAGE PATHS
    */
    const imagesPath = `${appConfig.backend_url}/backend/assets/${path}/`;

    return imagesPath;
  }

  public async getFileUrl(data: IVideoFilePathDTO): Promise<string | null> {
    /* CREATE URL */
    return `${appConfig.web_url}/downloads/${data.path}`;
  }

  public async serveImage(data: IServeImageDTO): Promise<void> {
    // return `${appConfig.web_url}/downloads/${data.path}`;
  }

  public async getFilePath(data: IVideoFilePathDTO): Promise<string | null> {
    const filePath = join(storageConfig.disk[data.folder], data.path);

    return filePath;
  }

  public async serveFile(data: IServeFileDTO): Promise<void> {
    const {
      response,
      file: { project_id, folder, path },
      fileName
    } = data;

    response.status(200).json({ message: 'ok' });
  }

  public async uploadFile(file: {
    folder: string;
    path: string;
    data: any;
  }): Promise<any> {
    const { folder, path, data } = file;

    await this.saveFile(file);
  }
}
