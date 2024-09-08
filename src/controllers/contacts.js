import createHttpError from 'http-errors';

import { addContact, deleteContact, getAllContacts, getContactById } from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
        throw createHttpError(404, `Contact with id ${contactId} not found`);
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const addContactController = async (req, res) => {
    const newContact = await addContact(req.boby);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;

    const result = await patchContactController({_id: contactId,}, req.body);

     if (!result) {
        throw createHttpError(404, `Contact with id ${contactId} not found`);
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result.data,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;

    const contact = await deleteContact(contactId);

    if (!contact) {
        throw createHttpError(404, `Movie with id=${contactId} not found`);
    }

    res.status(204).send();
};