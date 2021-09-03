import redisConfig from '@config/redis';
import storageConfig from '@config/storage';
import { IVideoFilePathDTO } from '@modules/orders/dtos/IVideoFilePathDTO';
import IFieldsDTO from '@modules/projects/dtos/IFieldsDTO';
import EmptyTemporaryImageSequence from '@modules/projects/utils/emptyTemporaryImageSequence';
import GetMusicFilename from '@modules/projects/utils/getMusicFilename';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import IRenderProvider from '@shared/container/providers/RenderProvider/models/IRenderProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IVideoConverterProvider from '@shared/container/providers/VideoConverterProvider/models/IVideoConverterProvider';
import AppError from '@shared/errors/AppError';
import crypto from 'crypto';
import fs from 'fs-extra';
import { join, resolve } from 'path';
import { inject, injectable } from 'tsyringe';

interface IJobData {
  project: {
    id: string;
    name: string;
    path: string;
    fields: IFieldsDTO[];
    duration: number;
  };
  is_preview?: boolean;
}

@injectable()
class ProcessRenderVideo {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('RenderProvider')
    private renderProvider: IRenderProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('VideoConverterProvider')
    private videoConverterProvider: IVideoConverterProvider
  ) {}

  queueName(): string {
    return 'RenderVideo';
  }
  /*
  RENDER VIDEO FILE
  */
  execute(): void {
    this.queueProvider.process('RenderVideo', async job => {
      const { project } = job.data as IJobData;
      /*
      CHECKS IF VIDEO IS PREVIEW OR DELIVERY
      is_preview ? if undefined we assume it is a preview.
      */
      const is_preview = job.data?.is_preview;
      // const { is_preview = true } = job.data as IJobData;
      // const is_preview = (job.data as IJobData)?.is_preview ?? true;
      const videoTypeToDeliver = is_preview ? 'preview' : 'delivery';

      // CREATE A RENDER STATUS OBJECTS
      const renderStatus0Pct = {
        step: 1,
        name: 'Rendering',
        percentage: 12,
        is_done: false
      };

      /*
      SAVE RENDER STATUS TO CACHE
      So we can recover this status on ShowRenderService to notify user about the progress.
      */
      await this.cacheProvider.saveWithExpiration(
        `${videoTypeToDeliver}-render:${project.id}`,
        renderStatus0Pct,
        redisConfig.token.expiresIn // 24 horas
      );

      /*
      GET LOTTIE JSON
      */
      const lottie_file = {
        folder: 'projects',
        path: join(`./${project.path}`, 'lottie.json')
      };
      const lottieParsed = await this.storageProvider.loadJson(lottie_file);

      /*
      UPDATE LOTTIE IMAGE PATHS TO RENDER
      */
      const lottie = {
        assets: lottieParsed.assets.map(asset => {
          asset.u = asset.u.replace('assets/images', 'assets/images/render');
          return asset;
        }),
        ...lottieParsed
      };

      /*
      CREATE TEMPORARY PATH FOR LOTTIE RENDER IMAGES (IMAGE_SEQUENCE ON FILESYSTEM)
      */
      const file_hash = crypto.randomBytes(10).toString('hex');
      const temp_dir = resolve(storageConfig.disk.private.temp, file_hash);
      try {
        await fs.ensureDir(temp_dir);
      } catch {
        throw new AppError('Could not create temporary folder');
      }
      const image_sequence = resolve(temp_dir, 'frame-%03d.png');

      /*
      RENDER IMAGE SEQUENCE
      */
      await this.renderProvider.create(lottie, image_sequence);

      // CREATE A RENDER STATUS OBJECTS
      const renderStatus50Pct = {
        step: 2,
        name: 'Encoding',
        percentage: 50,
        is_done: false
      };
      /*
      SAVE RENDER STATUS TO CACHE
      So we can recover this status on ShowRenderService to notify user about the progress.
      */
      await this.cacheProvider.saveWithExpiration(
        `${videoTypeToDeliver}-render:${project.id}`,
        renderStatus50Pct,
        redisConfig.token.expiresIn // 24 horas
        // storageConfig[videoTypeToDeliver].expiresIn // production: delivery 7 dias, preview 1 dia | development: delivery 5 minutos, preview: 5 minutos.
      );

      /*
      GET MUSIC FILENAME
      */
      let project_fields = project.fields;
      const music_filename = await GetMusicFilename(project_fields);

      /*
      GET MUSIC FILE
      */
      const music = is_preview
        ? resolve(
            storageConfig.disk.public.music,
            'samples',
            music_filename,
            `${music_filename}_sample_${project.duration}s.mp3`
          )
        : resolve(
            storageConfig.disk.private.music,
            music_filename,
            `${music_filename}_${project.duration}s.mp3`
          );

      /*
      GET WATERMARK
      */
      const watermark = resolve(
        storageConfig.disk.private.images,
        'watermark.png'
      );

      /*
      OUTPUT FILE
      */
      const video_filename = `ChocoAnimato_${videoTypeToDeliver}_${file_hash}_video.mp4`;
      const output = resolve(temp_dir, video_filename);

      /*
      CONVERT IMAGE SEQUENCE TO VIDEO
      */
      await this.videoConverterProvider.create({
        image_sequence,
        music,
        output,
        is_preview,
        watermark
      });
      let video_buffer: Buffer;
      /*
      GET RENDERED VIDEO FILE FROM 'TEMP' AS BUFFER
      */
      try {
        video_buffer = await fs.readFile(output);
      } catch (err) {
        throw new AppError('Error - Could not read video file');
      }

      /*
      SAVE VIDEO FILE
      path: `ChocoAnimato_${videoTypeToDeliver}_${file_hash}_video.mp4`;
      */
      await this.storageProvider.saveFile({
        folder: 'downloads',
        path: video_filename,
        data: video_buffer
      });

      /*
      SCHEDULE VIDEO FILE DELETION FOR DISK, FAKES3 ( delay action )
      AWS S3 does not need this, download bucket with policy to delete files accordingly.
      */
      if (storageConfig.driver !== 's3') {
        const filePath = await this.storageProvider.getFilePath({
          project_id: project.id,
          folder: 'downloads',
          path: video_filename
        });

        /*
        CHECK IF FILE EXISTS
        */
        const fileExists = await fs.pathExists(filePath);

        if (!fileExists) {
          throw new AppError('Error - File not found');
        }
        /*
        QUEUE FILE EXPIRATION
        */
        await this.queueProvider.add(
          'FileExpiration',
          {
            file: filePath
          },
          {
            delay: storageConfig[videoTypeToDeliver].expiresIn // production: delivery 7 dias, preview 1 dia | development: delivery 5 minutos, preview: 5 minutos.
          }
        );
      }
      /*
      RECOVER OLD VIDEO FILE TO DELETE IF IT STILL EXISTS.
      */
      const old_video = await this.cacheProvider.recover<IVideoFilePathDTO>(
        // preview-video-file
        `${videoTypeToDeliver}-video-file:${project.id}`
      );
      /*
      TRY TO DELETE OLD VIDEO FILE IF IT EXISTS
      */
      try {
        await this.storageProvider.deleteFile(old_video);
        // await fs.remove(old_video);
      } catch (err) {}

      /*
      VIDEO FILE INFO TO CACHE ( we want to retrieve this when generating shareable links)
      */
      const video_info = {
        project_id: project.id,
        name: project.name,
        folder: 'downloads',
        path: video_filename,
        type: videoTypeToDeliver
      };

      // add video info to cache
      await this.cacheProvider.saveWithExpiration(
        `${videoTypeToDeliver}-video-file:${project.id}`,
        video_info,
        storageConfig[videoTypeToDeliver].expiresIn // production: delivery 7 dias, preview 1 dia | development: delivery 5 minutos, preview: 5 minutos.
      );

      /*
      EMPTY TEMPORARY IMAGE SEQUENCE
      */
      await EmptyTemporaryImageSequence(temp_dir);

      // CREATE A RENDER STATUS OBJECT
      const renderStatus100Pct = {
        step: 2,
        name: 'Finished',
        percentage: 100,
        is_done: true
      };
      /*
      SAVE RENDER STATUS TO CACHE
      So we can recover this status on ShowRenderService to notify user about the progress.
      */
      await this.cacheProvider.saveWithExpiration(
        `${videoTypeToDeliver}-render:${project.id}`,
        renderStatus100Pct,
        redisConfig.token.expiresIn // 24 horas
      );
    });
  }
}

export default ProcessRenderVideo;
