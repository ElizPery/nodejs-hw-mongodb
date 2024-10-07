import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

export const userRegistrationSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Name should be a string',
        'string.min': 'Name should have at least {#limit} characters',
        'string.max': 'Name should have at most {#limit} characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().min(3).max(25).pattern(emailRegexp).required().messages({
        'string.base': 'Email should be a string',
        'string.min': 'Email should have at least {#limit} characters',
        'string.max': 'Email should have at most {#limit} characters',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.base': 'Password should be a string',
        'any.required': 'Password is required',
    }),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().min(3).max(25).pattern(emailRegexp).required().messages({
        'string.base': 'Email should be a string',
        'string.min': 'Email should have at least {#limit} characters',
        'string.max': 'Email should have at most {#limit} characters',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.base': 'Password should be a string',
        'any.required': 'Password is required',
    }),
});

export const requestResetEmailSchema = Joi.object({
    email: Joi.string().min(3).max(25).pattern(emailRegexp).required().messages({
        'string.base': 'Email should be a string',
        'string.min': 'Email should have at least {#limit} characters',
        'string.max': 'Email should have at most {#limit} characters',
        'any.required': 'Email is required',
    }),
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required().messages({
        'string.base': 'Password should be a string',
        'any.required': 'Password is required',
    }),
    token: Joi.string().required(),
});

export const userLoginWithGoogle = Joi.object({
    code: Joi.string().required(),
});