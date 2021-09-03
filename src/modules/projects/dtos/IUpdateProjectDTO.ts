import IFieldsDTO from './IFieldsDTO';

export default interface IUpdateProjectDTO {
  name?: string;
  sections?: Object[];
  fields?: IFieldsDTO[];
}
