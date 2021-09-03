import IFieldsDTO from '../dtos/IFieldsDTO';

interface Request {
  fields: IFieldsDTO[];
  fieldname: string;
}

const GetImageNameToDelete = async ({
  fields,
  fieldname
}: Request): Promise<any> => {
  /*
  GET OLD IMAGE NAME TO DELETE FILE
  */
  try {
    const findIndex = fields.findIndex(
      (field: IFieldsDTO) => field.fieldname === fieldname
    );

    return fields[findIndex].value;
  } catch (error) {
    return undefined;
  }
};

export default GetImageNameToDelete;
