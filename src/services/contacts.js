import { ContactsCollection } from "../db/models/contacts.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";

export const getContacts = async ({ page, perPage }) => {
    const skipCount = (page - 1) * perPage;

    const data = await ContactsCollection.find().skip(skipCount).limit(perPage);
    const count = await ContactsCollection.find().countDocuments();

    console.log(count);

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
