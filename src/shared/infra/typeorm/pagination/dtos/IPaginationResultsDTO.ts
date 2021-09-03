export interface IPaginationResultsDTO<PaginationEntity> {
  // results: PaginationEntity[];
  results: any;
  total: number;
  next?: string;
  previous?: string;
}
