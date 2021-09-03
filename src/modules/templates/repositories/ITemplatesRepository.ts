import Template from '@modules/templates/infra/typeorm/entities/Template';
import ICreateTemplateDTO from '../dtos/ICreateTemplateDTO';
import IIndexTemplateDTO from '../dtos/IIndexTemplateDTO';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import IUpdateTemplatesDTO from '../dtos/IUpdateTemplatesDTO';
// import { IPaginationOptionsDTO } from '@shared/infra/typeorm/pagination/dtos/IPaginationOptionsDTO';

export default interface ITemplatesRepository {
  paginate(data: IIndexTemplateDTO): Promise<Pagination<Template>>;
  findById(id: string): Promise<Template | undefined>;
  findByName(name: String): Promise<Template | undefined>;
  create(data: ICreateTemplateDTO): Promise<Template>;
  save(data: ICreateTemplateDTO): Promise<Template>;
  update({ ids, columns }: IUpdateTemplatesDTO): Promise<any>;
}
