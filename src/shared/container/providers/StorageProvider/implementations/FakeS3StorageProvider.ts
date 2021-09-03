import appConfig from '@config/app';
import storageConfig from '@config/storage';
import { IServeFileDTO } from '@modules/orders/dtos/IServeFileDTO';
import { IServeImageDTO } from '@modules/projects/dtos/IServeImageDTO';
import AppError from '@shared/errors/AppError';
import fs from 'fs-extra';
import mime from 'mime';
import * as AWSMock from 'mock-aws-s3';
import { join, resolve } from 'path';
import IStorageProvider from '../models/IStorageProvider';

AWSMock.config.basePath = storageConfig.disk.private.root;

// const awsMockConfig = {
//   params: { Bucket: 'example' }
// };

/*
FAKE S3 IS A TESTING GROUND FOR S3 IMPLEMENTATION. STORES AT DISK, BUT USES CALLS LIKE AWS SDK - TESTING PURPOSES ONLY.
*/
export default class FakeS3StorageProvider implements IStorageProvider {
  private client: AWSMock.S3;

  constructor() {
    // this.client = new AWSMock.S3(awsMockConfig);
    this.client = new AWSMock.S3();
  }

  public async createProjectFolders(
    template_path: string,
    project_path: string
  ): Promise<void> {
    /*
    LIST ALL OBJECTS FROM BUCKET 'PREFIX'
    */
    try {
      const listObjectsResponse = await this.client
        .listObjects({
          Bucket: storageConfig.s3.private.templates,
          Prefix: template_path
          // Delimiter: "/"
        })
        .promise();

      const folderContentInfo = listObjectsResponse.Contents;
      /* REMOVES THE PREFIX FROM SOURCE ( '/TEMPLATE_001') */
      // const folderPrefix = listObjectsResponse.CommonPrefixes[1].Prefix;
      const folderPrefix = `${template_path}/`;

      await Promise.all(
        folderContentInfo.map(async fileInfo => {
          /*
          IF FILE IS LOTTIE.JSON OR PROJECT.JSON
          */
          if (
            fileInfo.Key.includes('project.json') ||
            fileInfo.Key.includes('lottie.json')
          ) {
            await this.client
              .copyObject({
                Bucket: storageConfig.s3.private.projects,
                CopySource: `${storageConfig.s3.private.templates}/${fileInfo.Key}`, // old file Key
                Key: `${project_path}/${fileInfo.Key.replace(folderPrefix, '')}` // new file Key
              })
              .promise();
          }
        })
      );
    } catch (err) {
      return err;
    }
  }

  public async deleteFolder(data: {
    folder: string;
    path: string;
  }): Promise<void> {
    const { folder, path } = data;

    /*
    GET ALL OBJECTS ON THIS PREFIX ( FOLDER )
    */
    const listToDelete = async () => {
      const bucketObjects = await this.client
        .listObjects({
          Bucket: storageConfig.s3.private[folder],
          Prefix: `${path}/`
        })
        .promise();

      /*
      GET ALL OBJECTS WITH THE 'project_path' PREFIX.
      */
      const filteredObjects = bucketObjects.Contents.filter(item => {
        return path.indexOf(item.Key) > -1;
      });

      return filteredObjects.map(object => ({
        Key: object.Key
      }));
    };
    /*
    TRY TO DELETE ALL THE OBJECTS
    */
    const objectsToDelete = await listToDelete();
    try {
      await this.client
        .deleteObjects({
          Bucket: storageConfig.s3.private[folder],
          Delete: {
            Objects: objectsToDelete,
            Quiet: true
          }
        })
        .promise();
    } catch (error) {}
  }

  public async loadJson(file: { folder: string; path: string }): Promise<any> {
    const { folder, path } = file;
    /*
    GET JSON FILE
    */
    try {
      const data = await this.client
        .getObject({
          Bucket: storageConfig.s3.private[folder],
          Key: path
        })
        .promise();

      // const mimeType = data.ContentType.toString();
      const response = JSON.parse(data.Body.toString('utf-8'));
      return response;
    } catch (err) {
      // handle your error here
    }
  }

  public async saveJson(file: {
    folder: string;
    path: string;
    data: any;
  }): Promise<void> {
    const { folder, path, data } = file;

    let fileString = JSON.stringify(
      data,
      (k, v) => (Array.isArray(v) ? v.filter(e => e !== null) : v),
      2
    );

    const buffer = Buffer.from(fileString, 'utf-8');
    try {
      await this.client
        .putObject({
          Bucket: storageConfig.s3.private[folder],
          Key: path,
          Body: buffer
        })
        .promise();
    } catch (err) {}
  }

  public async saveFile(file: {
    folder: string;
    path: string;
    data: any;
    encoding?: BufferEncoding;
  }): Promise<any> {
    const { folder, path, data, encoding = 'utf-8' } = file;

    const contentType = mime.getType(path);

    const buffer = Buffer.from(data, encoding); // 'utf-8' | 'base64'
    try {
      const data = await this.client
        .putObject({
          Bucket: storageConfig.s3.private[folder],
          Key: path,
          Body: buffer,
          ContentEncoding: encoding,
          ContentType: contentType
        })
        .promise();
      return data;
    } catch (err) {
      throw new AppError('[SaveFile] Error saving file.');
    }
  }

  public async deleteFile(file: {
    folder: string;
    path: string;
  }): Promise<void> {
    const { folder, path } = file;
    try {
      await this.client
        .deleteObject({
          Bucket: storageConfig.s3.private[folder],
          Key: path
        })
        .promise();
    } catch (error) {
      console.log('[DeleteFile] File not found', error);
    }
  }

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
    // https://www.chocoanimato.com/backend/assets/images/[project_id]/
    // https://localhost/backend/assets/images/[project_id]/
    return `${appConfig.backend_url}/backend/assets/images/${path}/`;
  }

  // Used to get video previews or delivery urls
  public async getFileUrl(data: {
    project_id: string;
    folder: string;
    path: string;
    type?: string;
  }): Promise<string | null> {
    const { folder, path, project_id, type } = data;
    // // gets a filesystem path because this is a FakeS3Storage:
    const filePath = join(storageConfig.disk.private[folder], path);
    // const filePath = join(
    //   storageConfig.disk.private[folder],
    //   storageConfig.disk.private.downloads,
    //   path
    // );
    // console.log('filePath: ', filePath);
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

  // Gets the filesystem path for file
  public async getFilePath(data: {
    project_id: string;
    folder: string;
    path: string;
  }): Promise<string | null> {
    const { folder, path, project_id } = data;
    console.log('data: ', data);
    // // gets Disk path because this is a FakeS3Storage:
    const filePath = join(storageConfig.disk.private[folder], path);

    return filePath;
  }

  /*
  SERVE IMAGE
  */
  public async serveImage(data: IServeImageDTO): Promise<void> {
    const {
      response,
      file: { project_id, folder, path },
      fileName
    } = data;

    // If image file is transparent.png:
    if (fileName === 'transparent.png') {
      response.sendFile(join(storageConfig.disk.public.images, fileName));
    }

    response.sendFile(
      join(storageConfig.disk.private[folder], path, 'images', fileName)
    );
  }

  /*
  SERVE VIDEO TO DOWNLOAD
  */
  public async serveFile(data: IServeFileDTO): Promise<void> {
    const {
      response,
      file: { project_id, folder, path },
      fileName
    } = data;

    /*
    GET FILE METADATA
    */
    const metadata = await this.client
      .headObject({
        Bucket: storageConfig.s3.private[folder],
        Key: path
      })
      .promise();

    // /*
    // GENERATE RANDOM NAME
    // */
    // const fileName = `ChocoAnimato_video_${uuidv4()}.mp4`;
    /*
    SET RESPONSE METADATA
    */
    console.log('[Download] Last Modified', metadata.LastModified);
    response.setHeader('Content-Type', mime.getType(path));
    response.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    response.setHeader('Content-Length', metadata.ContentLength);
    response.setHeader('Last-Modified', String(metadata.LastModified));
    response.setHeader('ETag', metadata.ETag);

    /*
    CREATE A STREAM
    */
    const s3Stream = this.client
      .getObject({
        Bucket: storageConfig.s3.private[folder],
        Key: path
      })
      .createReadStream();

    // Listen for errors returned by the service
    s3Stream.on('error', err => {
      // NoSuchKey: The specified key does not exist
      console.error(err);
      throw new AppError('[Download] Error getting file.');
    });

    s3Stream
      .pipe(response)
      // .pipe(fileStream)
      .on('error', err => {
        // capture any errors that occur when writing data to the file
        console.error('[Download] File Stream: ', err);
      })
      .on('close', () => {
        console.log('[Download] File stream finished.');
        // response.set('Connection', 'close');
        response.end();
      });
  }

  /*
  SERVE VIDEO STREAM
  */
  // public async serveVideoStream(data: IServeFileDTO): Promise<any> {
  //   const {
  //     request,
  //     response,
  //     file: { project_id, folder, path }
  //   } = data;

  //   const filePath = resolve(storageConfig.disk.private[folder], path);

  //   // return filePath;
  //   // const path = 'assets/sample.mp4';
  //   const stat = fs.statSync(filePath);
  //   console.log({ stat });
  //   const fileSize = stat.size;
  //   const range = request.headers.range;
  //   if (range) {
  //     const parts = range.replace(/bytes=/, '').split('-');
  //     const start = parseInt(parts[0], 10);
  //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  //     const chunksize = end - start + 1;
  //     const file = fs.createReadStream(filePath, { start, end });
  //     const head = {
  //       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
  //       'Accept-Ranges': 'bytes',
  //       'Content-Length': chunksize,
  //       'Content-Type': 'video/mp4'
  //     };
  //     response.writeHead(206, head);
  //     file.pipe(response);
  //   } else {
  //     const head = {
  //       'Content-Length': fileSize,
  //       'Content-Type': 'video/mp4'
  //     };
  //     response.writeHead(200, head);
  //     fs.createReadStream(filePath).pipe(response);
  //   }
  // }

  public async uploadFile(file: {
    folder: string;
    path: string;
    data: any;
  }): Promise<any> {
    const { folder, path, data } = file;

    /*
    UPLOAD FILE
    */
    try {
      const response = await this.client
        .upload({
          Bucket: storageConfig.s3.private[folder],
          Key: path,
          Body: data
        })
        .promise();
      console.log('[Upload] File uploaded successfully!');
      return response;
    } catch (error) {
      console.log(error);
      throw new AppError('[Upload] Error uploading file.');
    }
  }
}
