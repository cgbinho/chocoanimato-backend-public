import CreateProjectService from '@modules/projects/services/CreateProjectService';
import DeleteProjectService from '@modules/projects/services/DeleteProjectService';
import IndexProjectService from '@modules/projects/services/IndexProjectService';
import ShowProjectService from '@modules/projects/services/ShowProjectService';
import UpdateProjectService from '@modules/projects/services/UpdateProjectService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import projectView from '../views/responses/projects.response';

export default class ProjectController {
  /*
  CREATE A PROJECT
  */
  public async create(request: Request, response: Response): Promise<Response> {
    // const { template_id } = request.body;
    // const { id: user_id } = request.user;
    const template_id = String(request.body.template_id);
    const user_id = String(request.user.id);

    const createProject = container.resolve(CreateProjectService);

    const project = await createProject.execute({
      template_id,
      user_id
    });

    return response.json(project);
  }

  /*
  INDEX ALL PROJECTS
  */
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = String(request.user.id);
    const page = Number(request.query.page);
    const { status = 'editing' }: any = request.query;
    const indexProjects = container.resolve(IndexProjectService);

    const projects = await indexProjects.execute({
      user_id,
      page,
      status
    });

    return response.json(projectView.index(projects));
  }
  /*
  SHOW A PROJECT
  */
  public async show(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const showProjects = container.resolve(ShowProjectService);

    const project = await showProjects.execute({ id });

    return response.json(projectView.render(project));
    // return response.json(project);
  }
  /*
  UPDATE A PROJECT
  */
  public async update(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const user_id = String(request.user.id);
    const file = request.files[0];
    const { body } = request;

    const updateProjects = container.resolve(UpdateProjectService);

    const project = await updateProjects.execute({
      id,
      user_id,
      file,
      body
    });

    return response.json(projectView.render(project));
  }
  /*
  DELETE A PROJECT
  */
  public async delete(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const deleteProjects = container.resolve(DeleteProjectService);

    const project = await deleteProjects.execute({ id });

    return response.json(project);
  }
}
