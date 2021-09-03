import { Router } from 'express';

import RendersController from '../controllers/RendersController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

import { ParamsIdv4Validation } from '@shared/infra/http/validations/shared.validations';

const renderRouter = Router();
const rendersController = new RendersController();

renderRouter.use(ensureAuthenticated);

/*
SHOW A RENDER BY ID
*/
renderRouter.get('/:id', ParamsIdv4Validation('id'), rendersController.show);

/*
POST A RENDER
*/
renderRouter.post('/:id', ParamsIdv4Validation('id'), rendersController.create);

export default renderRouter;
