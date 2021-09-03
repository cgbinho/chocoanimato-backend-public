import { Router } from 'express';

import MusicController from '../controllers/MusicController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const musicRouter = Router();
const musicController = new MusicController();

musicRouter.use(ensureAuthenticated);

/*
LIST ALL MUSIC
*/
musicRouter.get('/', musicController.index);

export default musicRouter;
