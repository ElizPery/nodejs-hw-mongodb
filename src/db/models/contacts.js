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
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

contactsSchema.post('save', handleSaveError);

contactsSchema.pre('findOneAndUpdate', setUpdateOptions);

export const sortField = ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType'];

export const ContactsCollection = model('contacts', contactsSchema);