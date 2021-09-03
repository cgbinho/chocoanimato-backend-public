export interface IUpdateProjectsDTO {
  ids: string[];
  columns: IColumnsDTO;
}
interface IColumnsDTO {
  [key: string]: any;
}
