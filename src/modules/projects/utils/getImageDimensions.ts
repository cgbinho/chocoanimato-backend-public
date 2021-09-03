import AppError from '@shared/errors/AppError';
import IFieldsDTO from '../dtos/IFieldsDTO';

interface IRequest {
  fields: IFieldsDTO[];
  file: Express.Multer.File;
}
interface IResponse {
  width: number;
  height: number;
}

const GetImageDimensions = async ({
  fields,
  file
}: IRequest): Promise<IResponse> => {
  /*
  GET IMAGE DIMENSIONS
  */
  /*
  FINDS THE FIELD RELATED TO THE IMAGE FILE:
  */
  try {
    const findIndex = fields.findIndex(
      (field: IFieldsDTO) => field.fieldname === file.fieldname
    );

    return {
      width: fields[findIndex].width,
      height: fields[findIndex].height
    };
  } catch {
    return;
  }
};

export default GetImageDimensions;
