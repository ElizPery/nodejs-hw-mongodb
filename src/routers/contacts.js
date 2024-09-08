import { Router } from "express";

import * as contactsControllers from '../controllers/contacts.js';

const contactsRouter = Router();

    contactsRouter.get('/', contactsControllers.getAllContactsController);

    contactsRouter.get('/:contactId', contactsControllers.getContactByIdController);

export default contactsRouter;