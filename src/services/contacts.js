import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = () => ContactsCollection.find();

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
