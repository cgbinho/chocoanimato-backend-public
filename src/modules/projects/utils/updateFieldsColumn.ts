import IFieldsDTO from '../dtos/IFieldsDTO';

interface Request {
  fields: IFieldsDTO[];
  fields_data: Object;
}

const UpdateFieldsColumn = async ({
  fields,
  fields_data
}: Request): Promise<IFieldsDTO[]> => {
  let response = [...fields];
  /*
  SEARCH FOR FIELDS TO UPDATE
  */
  response.forEach((field: IFieldsDTO) => {
    for (const item in fields_data) {
      /*
      FOUND THE ITEM, UPDATE FIELD VALUE
      */
      if (field.fieldname === item) {
        field.value = fields_data[item];
      }
    }
  });
  return response;
};

export default UpdateFieldsColumn;
