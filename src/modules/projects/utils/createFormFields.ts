import IFieldsDTO from '../dtos/IFieldsDTO';

interface Request {
  fields: IFieldsDTO[];
  project_name: string;
}

const CreateFormFields = async ({
  fields,
  project_name
}: Request): Promise<object> => {
  /*
  GET FORM VALUES
  */
  let form_values = {};
  // pegando o 'project_name':
  form_values['project_name'] = project_name;
  //todos os campos do formulário:
  fields.forEach((field: IFieldsDTO) => {
    form_values[field.fieldname] = field.value;
  });
  return form_values;
};

export default CreateFormFields;
