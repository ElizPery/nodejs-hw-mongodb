import createHttpError from 'http-errors';

import { addContact, deleteContact, getContacts, getContactById, patchContact } from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortField } from '../db/models/contacts.js';
import parseContactsFilter from '../utils/filters/parseContactsFilter.js';

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortField });
    const filter = parseContactsFilter(req.query);

    const contacts = await getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
    });

     if (contacts.data.length === 0) {
        throw createHttpError(404, `Contacts with this search queries not found`);
    }

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
    const newContact = await addContact(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;

    const result = await patchContact(contactId, req.body);

     if (!result) {
        throw createHttpError(404, `Contact with id ${contactId} not found`);
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result,
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