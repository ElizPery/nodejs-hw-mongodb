import Joi from 'joi';
import { contactTypeList } from '../constants/contacts.js';

export const createContactsSchema = Joi.object({
name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Name should be a string',
        'string.min': 'Name should have at least {#limit} characters',
        'string.max': 'Name should have at most {#limit} characters',
        'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Phone number should be a string',
        'string.min': 'Phone number should have at least {#limit} characters',
        'string.max': 'Phone number should have at most {#limit} characters',
        'any.required': 'Phone number is required',
    }),
    email: Joi.string().min(3).max(20).email().messages({
        'string.base': 'Email should be a string',
        'string.min': 'Email should have at least {#limit} characters',
        'string.max': 'Email should have at most {#limit} characters',
    }),
    isFavourite: Joi.boolean().messages({
        'boolean.base': 'IsFavourite should be a boolean',
    }),
    contactType: Joi.string().valid(...contactTypeList).required().messages({
        'string.base': 'ContactType should be a string',
        'any.required': 'ContactType is required',
    })
});