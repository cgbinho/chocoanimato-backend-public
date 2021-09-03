export default interface IUpdateTemplatesDTO {
  ids: string[];
  columns: IColumnsDTO;
}
interface IColumnsDTO {
  [key: string]: any;
}
