import ICreateTemplateDTO from '@modules/templates/dtos/ICreateTemplateDTO';
import IIndexTemplateDTO from '@modules/templates/dtos/IIndexTemplateDTO';
import IUpdateTemplatesDTO from '@modules/templates/dtos/IUpdateTemplatesDTO';
import ITemplatesRepository from '@modules/templates/repositories/ITemplatesRepository';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import { getRepository, In, LessThanOrEqual, Repository } from 'typeorm';
import Template from '../entities/Template';

class TemplatesRepository implements ITemplatesRepository {
  private ormRepository: Repository<Template>;

  constructor() {
    this.ormRepository = getRepository(Template);
  }

  public async paginate(
    options: IIndexTemplateDTO
  ): Promise<Pagination<Template>> {
    const {
      duration,
      category,
      ratio,
      sort = 'DESC',
      page,
      take = 6,
      status = 'active'
    } = options;
    /*
     page = 0,
      duration = 60,
      ratio = 'paisagem',
      category,
      sort = 'DESC',
      status = 'active',
      take = 6
    */
    //   /*
    //  QUERY FILTERS: SORT ( ASC, DESC ), DURATION, CATEGORY & PAGE.
    // Se a query de categoria for 'todas', não irá filtrar por category.
    //  */
    const queryOptions = Object.assign(
      {},
      duration &&
        duration !== '0' && {
          duration: LessThanOrEqual(duration)
        },
      category && category !== 'todas' && { category },
      ratio && ratio !== 'todas' && { ratio },
      status && { status }
    );

    const [results, total] = await this.ormRepository.findAndCount({
      where: queryOptions,
      order: {
        price: sort
      },
      skip: take * page,
      take: take
      // skip: 6 * page,
      // take: 6
    });

    return new Pagination<Template>({
      results,
      total
    });
  }

  public async findByName(name: string): Promise<Template | undefined> {
    const findTemplate = await this.ormRepository.findOne({ where: { name } });

    return findTemplate || null;
  }

  public async findById(id: string): Promise<Template | undefined> {
    const findTemplate = await this.ormRepository.findOne(id);

    return findTemplate || null;
  }

  public async create(data: ICreateTemplateDTO): Promise<Template> {
    const template = this.ormRepository.create(data);

    await this.ormRepository.save(template);

    return template;
  }

  public async save(template: Template): Promise<Template> {
    return this.ormRepository.save(template);
  }

  public async update({ ids, columns }: IUpdateTemplatesDTO): Promise<any> {
    const templatesUpdated = await this.ormRepository
      .createQueryBuilder('project')
      .update(Template)
      .set(columns)
      .where({ id: In(ids) })
      .execute();

    return templatesUpdated;
  }
}
export default TemplatesRepository;
