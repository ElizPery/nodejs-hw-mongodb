import { Router } from "express";

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from "../utils/ctrlWrapper.js";

const contactsRouter = Router();

    contactsRouter.get('/', ctrlWrapper(contactsControllers.getAllContactsController));

    contactsRouter.get('/:contactId', ctrlWrapper(contactsControllers.getContactByIdController));

export default contactsRouter;