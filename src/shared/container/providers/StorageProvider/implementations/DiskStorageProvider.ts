import appConfig from '@config/app';
import storageConfig from '@config/storage';
import { IServeFileDTO } from '@modules/orders/dtos/IServeFileDTO';
import { IVideoFilePathDTO } from '@modules/orders/dtos/IVideoFilePathDTO';
import { IServeImageDTO } from '@modules/projects/dtos/IServeImageDTO';
import AppError from '@shared/errors/AppError';
import fs from 'fs-extra';
import mime from 'mime';
import { join, normalize, resolve } from 'path';
import { CopyFiles } from '../lib/FileStates';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async createProjectFolders(
    template_path: string,
    project_path: string
  ): Promise<void> {
    /*
    CREATE PROJECT FOLDER
    */
    const projectPath = resolve(
      `${storageConfig.disk.private.projects}`,
      project_path
    );

    const templatePath = resolve(
      `${storageConfig.disk.private.templates}`,
      template_path
    );

    /*
    CREATE PROJECT FOLDER
    */
    try {
      // create project folder
      await fs.ensureDir(projectPath);
    } catch (err) {
      console.error(err);
    }
    /*
    COPY JSON FILES.
    */
    try {
      await CopyFiles(templatePath, projectPath, [
        'project.json',
        'lottie.json'
      ]);
    } catch (error) {
      throw new AppError('Error - Could not create project files');
    }

    /*
    CREATE TEMP FOLDERS TO STORE IMAGES, VIDEOS - OLD
    */
    // try {
    //   ['videos'].forEach(async folder => {
    //     await fs.ensureDir(`${projectPath}/temp/${folder}`);
    //   });
    // } catch (err) {
    //   throw new AppError(err);
    // }
  }

  public async deleteFolder(data: {
    folder: string;
    path: string;
  }): Promise<void> {
    const { folder, path } = data;
    const projectPath = resolve(`${storageConfig.disk.private[folder]}`, path);

    /*
    DELETE PROJECT FOLDER
    */
    try {
      // delete project folder
      await fs.remove(projectPath);
    } catch (err) {
      console.error(err);
    }
  }

  public async loadJson(file: { folder: string; path: string }): Promise<any> {
    /*
    LOAD JSON FILE
    */

    const filePath = normalize(
      join(storageConfig.disk.private[file.folder], file.path)
    );

    try {
      const fileBuffer = await fs.readFile(filePath, 'utf-8');
      const fileJson = JSON.parse(fileBuffer, (k, v) =>
        Array.isArray(v) ? v.filter(e => e !== null) : v
      );
      return fileJson;
    } catch (err) {
      throw new AppError('Could not load file');
    }
  }

  public async saveJson(file: {
    folder: string;
    path: string;
    data: any;
  }): Promise<void> {
    const filePath = normalize(
      join(storageConfig.disk.private[file.folder], file.path)
    );

    let fileString = JSON.stringify(
      file.data,
      (k, v) => (Array.isArray(v) ? v.filter(e => e !== null) : v),
      2
    );
    await fs.promises.writeFile(filePath, fileString);
  }

  public async saveFile(file: {
    folder: string;
    path: string;
    data: any;
    permission?: string;
    encoding?: BufferEncoding;
  }): Promise<string> {
    const {
      folder,
      path,
      data,
      encoding = 'utf-8',
      permission = 'private'
    } = file;
    /*
    NORMALIZE THE PATH. Ex: /projects/0000000/000000_name.jpg
    */
    const filePath = normalize(
      join(storageConfig.disk[permission][folder], path)
    );

    /*
    SAVE FILE
    */
    try {
      await fs.ensureFile(filePath);
    } catch (err) {
      console.error(err);
    }

    await fs.promises.writeFile(filePath, file.data, {
      encoding
    });

    return filePath;
  }

  public async deleteFile(file: {
    folder: string;
    path: string;
    permission?: string;
  }): Promise<void> {
    const { path, folder, permission = 'private' } = file;
    const filePath = join(storageConfig.disk[permission][folder], path);
    /*
    CHECK IF FILE EXISTS
    */
    const fileExists = await fs.pathExists(filePath);

    if (fileExists) {
      try {
        /*
        DELETE FILE
        */
        await fs.promises.unlink(filePath);
      } catch {
        return;
      }
    }
  }
  // Used to get the path for the images called on Lottie:
  public async getImagePath(data: {
    folder: string;
    path: string;
    removeImageFromField: string;
  }): Promise<string> {
    const { folder, path, removeImageFromField } = data;

    if (removeImageFromField) {
      return `${storageConfig.disk.url.images}/`;
    }
    /*
    GET THE RELATIVE PATH TO SET LOTTIE IMAGE PATHS
    'path' is the project id in this case:
    */
    // https://www.chocoanimato.com/backend/assets/[project_id]/
    // https://localhost/backend/assets/[project_id]/
    return `${appConfig.backend_url}/backend/assets/images/${path}/`;
  }

  // Used to get video previews or delivery urls
  public async getFileUrl(data: IVideoFilePathDTO): Promise<string | null> {
    const { folder, path, project_id, type } = data;
    // // gets a filesystem path because this is Disk Storage:
    const filePath = join(storageConfig.disk.private[folder], path);
    /*
    CHECK IF FILE EXISTS
    */
    const fileExists = await fs.pathExists(filePath);

    if (!fileExists) {
      throw new AppError('Error - File not found');
    }
    /* CREATE URL */
    // We are passing just the url.
    // The endpoint '/assets/videos/[type]/[project_id]' will call the file from disk or S3.
    // https://www.chocoanimato.com/backend/assets/videos/preview/[project_id]/
    return `${appConfig.backend_url}/backend/assets/videos/${type}/${project_id}`;
  }

  // Gets the filesystem path for file ( currently only to expire disk files)
  public async getFilePath(data: {
    project_id: string;
    folder: string;
    path: string;
  }): Promise<string | null> {
    const { folder, path, project_id } = data;

    const filePath = join(storageConfig.disk.private[folder], path);
    /*
    CHECK IF FILE EXISTS
    */
    const fileExists = await fs.pathExists(filePath);

    if (!fileExists) {
      throw new AppError('Error - File not found');
    }

    return filePath;
  }

  /*
  SERVE IMAGE
  */
  public async serveImage(data: IServeImageDTO): Promise<void> {
    const {
      response,
      file: { project, folder },
      fileName
    } = data;

    // If image file is transparent.png:
    if (fileName === 'transparent.png') {
      response.sendFile(join(storageConfig.disk.public.images, fileName));
    }

    // check if image comes from template or project folder:
    const fileExists = await fs.pathExists(
      join(storageConfig.disk.private[folder], project.path, 'images', fileName)
    );

    if (!fileExists) {
      // comes from template:
      response.sendFile(
        join(
          storageConfig.disk.public.templates,
          project.template.path,
          'images',
          fileName
        )
      );
    } else {
      // if image comes from project:
      response.sendFile(
        join(
          storageConfig.disk.private[folder],
          project.path,
          'images',
          fileName
        )
      );
    }
  }

  /*
  SERVE VIDEO TO DOWNLOAD
  */
  public serveFile(data: IServeFileDTO): void {
    const {
      request,
      response,
      file: { project_id, folder, path },
      fileName
    } = data;

    const filePath = resolve(storageConfig.disk.private[folder], path);
    // const filePath = resolve(storageConfig.disk.public.music, 'video.mp4');
    // response.sendFile(filePath);

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.range;
    if (range) {
      let parts = range.replace(/bytes=/, '').split('-');
      let start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      let chunkSize = end - start + 1;
      let file = fs.createReadStream(filePath, {
        start,
        end
      });
      let headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
      };

      response.writeHead(206, headers);
      file.pipe(response);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      };
      response.writeHead(200, head);
      fs.createReadStream(filePath).pipe(response);
    }
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
