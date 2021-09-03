import { Router } from 'express';

import TemplatesRepository from '@modules/templates/infra/typeorm/repositories/TemplatesRepository';

import TemplatesController from '../controllers/TemplatesController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

import { ParamsIdv4Validation } from '@shared/infra/http/validations/shared.validations';
import { templateValidation } from '../validations/templates.validations';

const templatesRouter = Router();
const templatesController = new TemplatesController();

/*
INDEX ALL TEMPLATES
*/
templatesRouter.get('/', templatesController.index);

/*
SHOW A TEMPLATE BY ID
*/
templatesRouter.get(
  '/:id',
  ParamsIdv4Validation('id'),
  templatesController.show
);

/* ADMIN ROUTES */
templatesRouter.use(ensureAuthenticated);
templatesRouter.use(ensureRole('admin'));

/*
POST A TEMPLATE
*/
templatesRouter.post('/', templateValidation, templatesController.create);
/*
UPDATE A TEMPLATE
*/
templatesRouter.patch(
  '/:id',
  ParamsIdv4Validation('id'),
  templateValidation,
  templatesController.update
);

export default templatesRouter;
