import CreateTemplateService from '@modules/templates/services/CreateTemplateService';
import IndexTemplateService from '@modules/templates/services/IndexTemplateService';
import ShowTemplateService from '@modules/templates/services/ShowTemplateService';
import UpdateTemplateService from '@modules/templates/services/UpdateTemplateService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import templateView from '../views/responses/templates.response';

export default class TemplateController {
  /*
  CREATE A TEMPLATE
  */
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      duration,
      ratio,
      price,
      path,
      category,
      status
    } = request.body;

    const createTemplate = container.resolve(CreateTemplateService);

    const template = await createTemplate.execute({
      name,
      description,
      duration,
      ratio,
      price,
      path,
      category,
      status
    });

    return response.json(template);
  }

  /*
  INDEX ALL TEMPLATES
  */
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      duration,
      category,
      ratio,
      page,
      limit,
      take,
      sort,
      is_active
    } = request.query;

    const indexTemplates = container.resolve(IndexTemplateService);

    const templates = await indexTemplates.execute(request.query);
    return response.json(templateView.index(templates));
  }
  /*
  SHOW A TEMPLATE
  */
  public async show(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    // const { id } = request.params;
    const showTemplate = container.resolve(ShowTemplateService);

    const template = await showTemplate.execute({ id });

    return response.json(templateView.render(template));
  }

  /*
  UPDATE A TEMPLATE
  */
  public async update(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const user_id = String(request.user.id);
    const { body } = request;

    const updateTemplate = container.resolve(UpdateTemplateService);

    const project = await updateTemplate.execute({
      id,
      body
    });

    return response.json(project);
  }
}
