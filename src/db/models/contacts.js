import { model, Schema } from "mongoose";
import { contactTypeList } from "../../constants/contacts.js";
import { handleSaveError, setUpdateOptions } from "./hooks.js";

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: contactTypeList,
            required: true,
            default: 'personal',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

contactsSchema.post('save', handleSaveError);

contactsSchema.pre('findOneAndUpdate', setUpdateOptions);

export const ContactsCollection = model('contacts', contactsSchema);