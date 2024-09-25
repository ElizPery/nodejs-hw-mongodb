import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contacts.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";

export const getContacts = async ({
    page = 1 ,
    perPage = 10,
    sortBy = '_id',
    sortOrder = SORT_ORDER[0],
    filter = {}
    }) => {
    const skipCount = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();

    if (filter.type) {
        contactsQuery.where('contactType').equals(filter.type);
    }
 
    if (filter.isFavourite !== undefined && filter.isFavourite !== null) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    if (filter.userId) {
        contactsQuery.where('userId').equals(filter.userId);
    }

    const count = await ContactsCollection.find().merge(contactsQuery).countDocuments();
    const data = await contactsQuery.skip(skipCount).limit(perPage).sort({[sortBy]: sortOrder}).exec();

    const paginationData = calculatePaginationData({ count, page, perPage });

    return {data, ...paginationData};
};

export const getContactById = (filter) => ContactsCollection.findOne(filter);
    
export const addContact = (payload) => ContactsCollection.create(payload);

export const patchContact = async (filter, data, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(filter, data, {
        includeResultMetadata: true,
        ...options,
    });

    if (!rawResult || !rawResult.value) return null;

    return rawResult.value;
};

export const deleteContact = (contactId) => ContactsCollection.findOneAndDelete({_id: contactId,});
