import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contacts.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";

export const getContacts = async ({
    page = 1 ,
    perPage = 10,
    sortBy = '_id',
    sortOrder = SORT_ORDER[0],
    }) => {
    const skipCount = (page - 1) * perPage;

    const data = await ContactsCollection.find().skip(skipCount).limit(perPage).sort({[sortBy]: sortOrder});
    const count = await ContactsCollection.find().countDocuments();

    const paginationData = calculatePaginationData({ count, page, perPage });

    return {data, ...paginationData};
};

export const getContactById = (contactId) => ContactsCollection.findById(contactId);
    
export const addContact = (payload) => ContactsCollection.create(payload);

export const patchContact = async (contactId, data, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate({_id: contactId,}, data, {
        includeResultMetadata: true,
        ...options,
    });

    if (!rawResult || !rawResult.value) return null;

    return rawResult.value;
};

export const deleteContact = (contactId) => ContactsCollection.findOneAndDelete({_id: contactId,});
