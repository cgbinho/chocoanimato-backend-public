import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';
import { sessionValidation } from '../validations/users.validations';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', sessionValidation, sessionsController.create);
sessionsRouter.get('/google', sessionsController.createGoogleUrl);
sessionsRouter.get('/google/callback', sessionsController.createGoogleSession);

export default sessionsRouter;
