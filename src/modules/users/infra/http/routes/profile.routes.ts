import { Router } from 'express';

import ProfilesController from '../controllers/ProfilesController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import { updateProfileValidation } from '../validations/users.validations';

import { ParamsIdv4Validation } from '@shared/infra/http/validations/shared.validations';

const profileRouter = Router();
const profilesController = new ProfilesController();

profileRouter.use(ensureAuthenticated);

/*
GET A PROFILE
*/
profileRouter.get('/:id', ParamsIdv4Validation('id'), profilesController.show);

/*
UPDATE A PROFILE
*/
profileRouter.put('/', updateProfileValidation, profilesController.update);

export default profileRouter;
