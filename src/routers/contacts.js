import { Router } from "express";

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from "../utils/ctrlWrapper.js";

import validateBody from "../utils/validateBody.js";
import { createContactsSchema } from "../validation/contacts.js";

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactsControllers.getAllContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(contactsControllers.getContactByIdController));

contactsRouter.post('/', validateBody(createContactsSchema), ctrlWrapper(contactsControllers.addContactController));
    
contactsRouter.patch('/:contactId', ctrlWrapper(contactsControllers.patchContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(contactsControllers.deleteContactController));

export default contactsRouter;