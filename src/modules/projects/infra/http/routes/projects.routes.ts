import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import Project from '@modules/projects/infra/typeorm/entities/Project';

import ProjectsController from '../controllers/ProjectsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

import {
  setEntity,
  ensureCanViewEntity
} from '@modules/users/infra/http/middlewares/ensureCanViewEntity';

import { ParamsIdv4Validation } from '@shared/infra/http/validations/shared.validations';
import {
  createProjectValidation,
  updateProjectValidation
} from '../validations/projects.validations';

const projectsRouter = Router();
const projectsController = new ProjectsController();

const upload = multer(uploadConfig.multer);

projectsRouter.use(ensureAuthenticated);

/*
INDEX ALL PROJECTS
*/
projectsRouter.get('/', projectsController.index);

/*
POST A PROJECT
*/
projectsRouter.post('/', createProjectValidation, projectsController.create);

/* USER + ADMIN ROUTES */
/*
SHOW A PROJECT BY ID
*/
projectsRouter.get(
  '/:id',
  ParamsIdv4Validation('id'),
  setEntity(Project, 'project'),
  ensureCanViewEntity('project'),
  projectsController.show
);

/*
UPDATE A PROJECT
*/
projectsRouter.put(
  '/:id',
  upload.any(),
  updateProjectValidation,
  setEntity(Project, 'project'),
  ensureCanViewEntity('project'),
  projectsController.update
);

/*
DELETE A PROJECT
*/
projectsRouter.delete(
  '/:id',
  ParamsIdv4Validation('id'),
  setEntity(Project, 'project'),
  ensureCanViewEntity('project'),
  projectsController.delete
);

export default projectsRouter;
