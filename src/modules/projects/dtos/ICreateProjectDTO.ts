import ICreateTemplateDTO from '@modules/templates/dtos/ICreateTemplateDTO';
import IFieldsDTO from '../dtos/IFieldsDTO';
/*
LINK GENERATED AT DELIVERY
*/
export default interface ICreateProjectDTO {
  template_id: string;
  user_id: string;
  name: string;
  path: string;
  sections: Object[];
  fields: IFieldsDTO[];
  status: string;
  id?: string;
  link?: String;
  price_formatted?: string;
  template?: ICreateTemplateDTO;
}
