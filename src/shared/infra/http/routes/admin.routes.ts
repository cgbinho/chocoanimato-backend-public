import { Router } from 'express';
import { router } from 'bull-board';
import appConfig from '@config/app';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAuthenticatedByCookies from '@modules/users/infra/http/middlewares/ensureAuthenticatedByCookies';
import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

const adminRouter = Router();

/*
MANAGE QUEUE
*/
const isDev = appConfig.node_env === 'development' ? true : false;

const authMiddleware = isDev ? [] : [ensureAuthenticated, ensureRole('admin')];

adminRouter.use('/queues', authMiddleware, router);

adminRouter.get(
  '/test',
  ensureAuthenticated,
  ensureRole('admin'),
  (req, res) => {
    res.status(200).json({ message: 'Admin request successfull' });
  }
);

export default adminRouter;
