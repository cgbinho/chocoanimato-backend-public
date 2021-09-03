import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import ConfirmUsersController from '../controllers/ConfirmUsersController';

import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import {
  confirmUsersValidation,
  createUserValidation
} from '../validations/users.validations';

const usersRouter = Router();

const usersController = new UsersController();
const confirmUsersController = new ConfirmUsersController();

/*
CREATE USER
*/
usersRouter.post('/', createUserValidation, usersController.create);

/*
CONFIRM USER REGISTRATION
*/
usersRouter.post(
  '/confirm/:confirmation_token',
  confirmUsersValidation,
  confirmUsersController.update
);

/* ADMIN ROUTES */
usersRouter.use(ensureAuthenticated);
usersRouter.use(ensureRole('admin'));

/*
INDEX ALL USERS
*/
usersRouter.get('/', usersController.index);
/*
SHOW AN USER
*/
usersRouter.get('/:email', usersController.showByEmail);
/*
UPDATE USER
*/
usersRouter.patch('/:email', usersController.updateByEmail);
/*
DELETE USER
*/
usersRouter.delete('/:email', usersController.deleteByEmail);

export default usersRouter;
