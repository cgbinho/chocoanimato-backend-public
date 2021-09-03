import { injectable, inject } from 'tsyringe';

import ITemplatesRepository from '../repositories/ITemplatesRepository';

import AppError from '@shared/errors/AppError';

interface Request {
  id: string;
  body?: any;
}

@injectable()
class UpdateTemplateService {
  constructor(
    @inject('TemplatesRepository')
    private templatesRepository: ITemplatesRepository
  ) {}

  public async execute({ id, body }: Request): Promise<Object> {
    /*
    GET TEMPLATE
    */
    const templateToUpdate = await this.templatesRepository.findById(id);

    if (!templateToUpdate) {
      throw new AppError('Template does not exist.');
    }
    /*
    'CREATE' FINDS THE ENTRY WITH THE ID AND UPDATES:
    */
    const template = await this.templatesRepository.create({
      id,
      ...body
    });

    return template;
  }
}

export default UpdateTemplateService;
