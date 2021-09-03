import appConfig from '@config/app';
import awsConfig from '@config/aws';
import storageConfig from '@config/storage';
import { IServeFileDTO } from '@modules/orders/dtos/IServeFileDTO';
import { IServeImageDTO } from '@modules/projects/dtos/IServeImageDTO';
import AppError from '@shared/errors/AppError';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';
import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3(awsConfig.s3);
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
    } catch (err) {
      console.log(err, err.stack);
    }
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
      console.log(err, err.stack);
      throw new AppError('[SaveFile] Error saving file.');
    }

    /*
    UPLOAD FILE
    */
    //  try {
    //    const response = await this.client
    //      .upload({
    //        Bucket: storageConfig.buckets[folder],
    //        Key: path,
    //        Body: data
    //      })
    //      .promise();
    //    console.log('[Upload] File uploaded successfully!');
    //    return response;
    //  } catch (error) {
    //    console.log(error);
    //    throw new AppError('[Upload] Error uploading file.');
    //  }
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

  // Used to get the path for the images called on Lottie:
  public async getImagePath(data: {
    folder: string;
    path: string;
    removeImageFromField: string;
  }): Promise<string> {
    const { folder, path, removeImageFromField } = data;
    /*
    GET THE RELATIVE PATH TO SET LOTTIE IMAGE PATHS
    */
    // let image_path: string;
    // IF NO IMAGE TO DISPLAY, USE 'TRANSPARENT.PNG' PATH:
    if (removeImageFromField) {
      return `${storageConfig.s3.url.images}/`;
    }
    return `${appConfig.backend_url}/backend/assets/images/${path}/`;
  }

  // Used to get video previews or delivery urls
  public async getFileUrl(data: {
    project_id: string;
    folder: string;
    path: string;
    type?: string;
  }): Promise<string | null> {
    const { project_id, folder, path, type } = data;

    const filePath = await this.client.getSignedUrlPromise('getObject', {
      Bucket: storageConfig.s3.private[folder],
      Key: path
    });

    if (!filePath) {
      throw new AppError('Error - File not found');
    }
    /* CREATE URL */
    // We are passing just the url.
    // The endpoint '/assets/videos/[type]/[project_id]' will call the file from disk or S3.
    // https://www.chocoanimato.com/backend/assets/preview/[project_id]/
    return `${appConfig.backend_url}/backend/assets/videos/${type}/${project_id}`;
  }

  // Gets the filesystem path for file ( currently only to expire disk files)
  public async getFilePath(data: {
    project_id: string;
    folder: string;
    path: string;
  }): Promise<string | null> {
    const { project_id, folder, path } = data;

    try {
      const filePath = await this.client.getSignedUrlPromise('getObject', {
        Bucket: storageConfig.s3.private[folder],
        Key: path
      });
      return filePath;
    } catch (error) {
      return null;
    }
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

    /*
    GET FILE METADATA
    */
    const metadata = await this.client
      .headObject({
        Bucket: storageConfig.s3.private[folder],
        Key: `${path}/images/${fileName}`
      })
      .promise();

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
        Key: `${path}/images/${fileName}`
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
      .on('close', () => {});
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

    /*
    GENERATE RANDOM NAME
    */
    // const fileName = `ChocoAnimato_video_${uuidv4()}.mp4`;
    /*
    SET RESPONSE METADATA
    */
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
      });
  }

  public async uploadFile(file: {
    folder: string;
    path: string;
    data: any;
  }): Promise<any> {
    const { folder, path, data } = file;

    // const filePath = normalize(
    //   join(storageConfig.disk[file.folder], file.path)
    // );

    // // Read content from the file
    // const fileBuffer = await fs.promises.readFile(filePath);

    // if (!fileBuffer) {
    //   throw new AppError('[Upload] Error getting file');
    // }
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
