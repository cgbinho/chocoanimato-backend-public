import { Router } from 'express';
import ContactMailController from '../controllers/ContactMailController';

import { contactMailValidation } from '../validations/users.validations';
const contactRouter = Router();

const contactMailController = new ContactMailController();

/*
CONTACT FORM MESSAGE
*/
contactRouter.post('/', contactMailValidation, contactMailController.create);

export default contactRouter;
