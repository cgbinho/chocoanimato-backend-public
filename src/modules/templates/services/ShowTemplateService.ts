import AppError from '@shared/errors/AppError';

import Template from '@modules/templates/infra/typeorm/entities/Template';
import ITemplatesRepository from '../repositories/ITemplatesRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  id: string;
}

@injectable()
class ShowTemplateService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Template> {
    /*
    SHOW A TEMPLATE
    */
    const template = await this.templatesRepository.findById(id);

    if (!template) {
      throw new AppError('No templates found');
    }

    return template;
  }
}

export default ShowTemplateService;
