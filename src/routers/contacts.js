import { Router } from "express";

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from "../utils/ctrlWrapper.js";

import validateBody from "../utils/validateBody.js";
import { createContactsSchema, patchContactsSchema } from "../validation/contacts.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get('/:contactId',isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

contactsRouter.post('/', upload.single('photo'), validateBody(createContactsSchema), ctrlWrapper(contactsControllers.addContactController));
    
contactsRouter.patch('/:contactId', upload.single('photo'), isValidId, validateBody(patchContactsSchema), ctrlWrapper(contactsControllers.patchContactController));

contactsRouter.delete('/:contactId',isValidId,  ctrlWrapper(contactsControllers.deleteContactController));

export default contactsRouter;