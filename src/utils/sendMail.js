import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { env } from './env.js';
import createHttpError from 'http-errors';

const nodemailerConfig = {
    host: env(SMTP.SMTP_HOST),
    port: Number(env(SMTP.SMTP_PORT)),
    auth: {
        user: env(SMTP.SMTP_USER),
        pass: env(SMTP.SMTP_PASSWORD),
    },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (options) => {
    const sendedMail = await transporter.sendMail(options);

    if (!sendedMail) {
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
    
    return sendedMail;
};