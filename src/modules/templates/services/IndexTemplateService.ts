import AppError from '@shared/errors/AppError';

import Template from '@modules/templates/infra/typeorm/entities/Template';
import ITemplatesRepository from '../repositories/ITemplatesRepository';
import IIndexTemplateDTO from '../dtos/IIndexTemplateDTO';

import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';

import { injectable, inject } from 'tsyringe';

@injectable()
class IndexTemplateService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository
  ) {}

  public async execute(data: IIndexTemplateDTO): Promise<Pagination<Template>> {
    /*
     QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
     */
    const { page, duration, ratio, category, sort, status, take } = data;

    const { results, total } = await this.templatesRepository.paginate({
      category,
      duration,
      ratio,
      page,
      sort,
      status,
      take
    });

    return new Pagination<Template>({
      results,
      total
    });
  }
}

export default IndexTemplateService;
