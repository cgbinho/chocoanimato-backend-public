export default interface IFieldsDTO {
  id: number;
  text: string;
  fieldname: string;
  section: string;
  category: string;
  value: string;
  toolTip: string;
  propPath?: string;
  width?: number;
  height?: number;
}
