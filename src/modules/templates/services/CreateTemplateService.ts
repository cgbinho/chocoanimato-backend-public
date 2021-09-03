import AppError from '@shared/errors/AppError';

import Template from '@modules/templates/infra/typeorm/entities/Template';
import ITemplatesRepository from '../repositories/ITemplatesRepository';
import { injectable, inject } from 'tsyringe';
import ICreateTemplateDTO from '../dtos/ICreateTemplateDTO';

@injectable()
class CreateTemplateService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository
  ) {}

  public async execute(data: ICreateTemplateDTO): Promise<Template> {
    const {
      name,
      description,
      ratio,
      path,
      category,
      price,
      duration,
      status
    } = data;

    const findTemplate = await this.templatesRepository.findByName(name);

    /*
    FIND IF A TEMPLATE ALREADY EXISTS WITH SAME NAME
    */
    if (findTemplate) {
      throw new AppError('This template already exist');
    }

    const template = await this.templatesRepository.create({
      name,
      category,
      path,
      description,
      duration,
      ratio,
      price,
      status
    });

    return template;
  }
}

export default CreateTemplateService;
