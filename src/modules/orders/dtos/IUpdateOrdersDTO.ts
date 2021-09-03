export interface IUpdateOrdersDTO {
  ids: string[];
  columns: IColumnsDTO;
}
interface IColumnsDTO {
  [key: string]: any;
}
