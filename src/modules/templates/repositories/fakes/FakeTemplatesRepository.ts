import { v4 as uuidv4 } from 'uuid';

import ITemplatesRepository from '@modules/templates/repositories/ITemplatesRepository';
import ICreateTemplateDTO from '@modules/templates/dtos/ICreateTemplateDTO';
import IIndexTemplateDTO from '@modules/templates/dtos/IIndexTemplateDTO';

import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

import Template from '../../infra/typeorm/entities/Template';
import IUpdateTemplatesDTO from '@modules/templates/dtos/IUpdateTemplatesDTO';

class TemplatesRepository implements ITemplatesRepository {
  private templates: Template[] = [];

  public async paginate(
    options: IIndexTemplateDTO
  ): Promise<Pagination<Template>> {
    //   /*
    //  QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
    //  */

    // sort?: any;
    // category?: any;
    // duration?: any;
    // page?: any;
    // take?: any;
    // skip?: any;
    // limit ?: any;

    const findTemplates = this.templates;
    const total = findTemplates.length;

    return new Pagination<Template>({
      results: findTemplates,
      total
    });
  }

  public async findByName(name: string): Promise<Template | undefined> {
    const findTemplate = this.templates.find(
      template => template.name === name
    );

    return findTemplate;
  }

  public async findById(id: string): Promise<Template | undefined> {
    const findTemplate = this.templates.find(template => template.id === id);

    return findTemplate;
  }

  public async create({
    name,
    category,
    path,
    description,
    duration,
    ratio,
    price,
    status
  }: ICreateTemplateDTO): Promise<Template> {
    const template = new Template();

    Object.assign(
      template,
      { id: uuidv4() },
      { name },
      { category },
      { path },
      { description },
      { duration },
      { ratio },
      { price },
      { status }
    );

    this.templates.push(template);

    return template;
  }

  public async save(template: Template): Promise<Template> {
    return;
  }

  public async update({ ids, columns }: IUpdateTemplatesDTO): Promise<any> {
    return;
  }
}
export default TemplatesRepository;
