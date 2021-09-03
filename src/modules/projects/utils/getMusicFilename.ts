import AppError from '@shared/errors/AppError';
import IFieldsDTO from '../dtos/IFieldsDTO';

const getMusicFilename = async (fields: IFieldsDTO[]): Promise<string> => {
  /*
  GET MUSIC FILENAME
  */
  try {
    let fieldIndex = fields.findIndex(field => field.category === 'sound');
    return fields[fieldIndex].value;
  } catch (err) {
    return;
  }
};

export default getMusicFilename;
