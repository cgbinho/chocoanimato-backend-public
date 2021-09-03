import { Router } from 'express';

import VideoController from '../controllers/VideoController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAuthenticatedByCookies from '@modules/users/infra/http/middlewares/ensureAuthenticatedByCookies';
import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

import {
  QueryIdv4Validation,
  ParamsIdv4Validation,
  ParamsIdv4AndStringValidation
} from '@shared/infra/http/validations/shared.validations';

const videosRouter = Router();
const videoController = new VideoController();

videosRouter.use(ensureAuthenticatedByCookies);
// videosRouter.use(ensureAuthenticated);

/*
SHOW A VIDEO BY TYPE AND ID
type: 'delivery' | 'preview'
id: download id.
*/
videosRouter.get(
  '/:type/:id',
  ParamsIdv4AndStringValidation('type', 'id'),
  videoController.show
);

export default videosRouter;
