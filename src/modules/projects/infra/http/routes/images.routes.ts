import { Router } from 'express';
import AssetsController from '../controllers/AssetsController';
import ensureAuthenticatedByCookies from '@modules/users/infra/http/middlewares/ensureAuthenticatedByCookies';
// import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const assetsRouter = Router();
const assetsController = new AssetsController();
/*
SHOW AN ASSET BY NAME TO BACKEND RENDERING
*/
assetsRouter.get('/render/:id/:filename', assetsController.showToRender);

assetsRouter.use(ensureAuthenticatedByCookies);

/*
SHOW AN ASSET BY NAME TO USER PREVIEWING
*/
assetsRouter.get('/:id/:filename', assetsController.show);

export default assetsRouter;

/*

'assets/render/' ( )
*/
