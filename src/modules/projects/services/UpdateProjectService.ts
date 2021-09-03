import { Express } from 'express';
import { injectable, inject, container } from 'tsyringe';
import { join, extname } from 'path';
import crypto from 'crypto';
import { DeleteFile } from '@shared/container/providers/StorageProvider/lib/FileStates';

import IProjectsRepository from '../repositories/IProjectsRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IImageTransformProvider from '@shared/container/providers/ImageTransformProvider/models/IImageTransformProvider';

import UpdateFieldsColumn from '../utils/updateFieldsColumn';
import CreateFormFields from '../utils/createFormFields';

import AppError from '@shared/errors/AppError';

import UpdateLottieFile from '../utils/updateLottieFile';
import IFieldsDTO from '../dtos/IFieldsDTO';
import RemoveOldImageService from './RemoveOldImageService';
import UpdateImageService from './UpdateImageService';

interface Request {
  id: string;
  user_id: string;
  body?: any;
  file?: Express.Multer.File;
}

@injectable()
class UpdateProjectService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('ImageTransformProvider')
    private imageTransformProvider: IImageTransformProvider
  ) {}

  public async execute({ user_id, id, body, file }: Request): Promise<Object> {
    /*
    GET PROJECT REPOSITORY
    */
    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new AppError('Project does not exist.');
    }

    /*
    GET NEW PROJECT NAME IF EXISTS AND FORM_VALUES
    */
    const { project_name, ...some_form_values } = body;
    /* GROUP FIELDS WITH FILE FIELD (to easily update project.fields)*/
    let fields_data = Object.assign({}, some_form_values);

    /*
    UPDATE PROJECT NAME - If user requested a new project_name, update:
    */
    if (project_name) {
      project.name = project_name;
    }

    /* TO REMOVE IMAGE FROM FIELD:  */
    if (fields_data?.removeImageFromField) {
      // GET FIELD NAME to REMOVE IMAGE.
      const fieldname = fields_data.removeImageFromField;

      // Removes old Image
      const removeOldImageService = container.resolve(RemoveOldImageService);
      await removeOldImageService.execute({ project, fieldname });

      // ADDS TRANSPARENT IMAGE TO FIELD:
      fields_data = Object.assign({}, some_form_values, {
        [fieldname]: 'transparent.png'
      });
    }

    /*
    IF FILE IS UPLOADED:
    */
    if (file) {
      // Update image
      const updateImageService = container.resolve(UpdateImageService);
      const outputFilename = await updateImageService.execute({
        project,
        fields_data,
        file
      });

      /*
      ADD FILE TO FIELDS_DATA ( so we can update the lottie file)
      */
      fields_data = Object.assign({}, some_form_values, {
        [file.fieldname]: outputFilename
      });
    }

    // /* LOAD LOTTIE JSON TO GET FIELDS AND SECTIONS */
    let lottieData = await this.storageProvider.loadJson({
      folder: 'projects',
      path: join(`./${project.path}`, 'lottie.json')
    });

    /*
    CHECK IF THERE IS NEW FIELD DATA TO BE UPDATED:
    projeto tem update nos fields? precisa atualizar o lottie, o project.fields, o form_values.
    return lottie, project e form_values atualizados.
    */
    if (Object.keys(fields_data).length !== 0) {
      /*
      UPDATES THE COLUMN FIELD
      */
      project.fields = await UpdateFieldsColumn({
        fields: project.fields,
        fields_data
      });

      /*
      GET IMAGE PATH ( project id as path or transparent.png)
      */
      let image_path: string = '';

      image_path = await this.storageProvider.getImagePath({
        folder: 'projects',
        path: project.id,
        removeImageFromField: fields_data.removeImageFromField
      });

      /* UPDATE IMAGE PATHS */
      lottieData = await UpdateLottieFile({
        lottie: lottieData,
        fields: project.fields as IFieldsDTO[],
        imageData: {
          file,
          removeImageFromField: fields_data?.removeImageFromField,
          image_path
        }
      });

      /* SAVE UPDATED LOTTIE */
      await this.storageProvider.saveJson({
        folder: 'projects',
        path: join(`./${project.path}`, 'lottie.json'),
        data: lottieData
      });
    }

    /*
    FORMATTING RESPONSE: CREATE FORM_VALUES FIELD
    form_field is a field to populate react-hooks-form @ frontend.
    */
    const form_values = await CreateFormFields({
      fields: project.fields as IFieldsDTO[],
      project_name: project.name
    });

    /*
   UPDATE PROJECT STATUS
   */
    await this.projectsRepository.save(project);

    return { form_values, lottie: lottieData, ...project };
  }
}

export default UpdateProjectService;
