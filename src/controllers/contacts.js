import createHttpError from 'http-errors';

import { addContact, deleteContact, getContacts, getContactById, patchContact } from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortField } from '../db/models/contacts.js';
import parseContactsFilter from '../utils/filters/parseContactsFilter.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortField });
    const filter = parseContactsFilter(req.query);
    const {_id: userId} = req.user;

    const contacts = await getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter: {...filter, userId},
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
    const { _id: userId } = req.user;

    const contact = await getContactById({ _id: contactId, userId });

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
    let photo;

    if (req.file) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photo = await saveFileToCloudinary(req.file);
        } else {
            photo = await saveFileToUploadsDir(req.file);
        }
    }

    const { _id: userId } = req.user;
    const newContact = await addContact({ ...req.body, userId, photo });


    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    let photo;

    if (req.file) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photo = await saveFileToCloudinary(req.file);
        } else {
            photo = await saveFileToUploadsDir(req.file);
        }
    }

    const result = await patchContact({ _id: contactId, userId }, { ...req.body, photo});

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
    const {_id: userId} = req.user;

    const contact = await deleteContact({_id:contactId, userId});

    if (!contact) {
        throw createHttpError(404, `Movie with id=${contactId} not found`);
    }

    res.status(204).send();
};