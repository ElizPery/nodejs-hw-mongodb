import { OAuth2Client } from "google-auth-library";
import path from 'node:path';
import { readFile } from 'fs/promises';
import createHttpError from 'http-errors';

import { env } from "./env.js";

const PATH_JSON = path.resolve('google-oauth.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
    clientId: env('GOOGLE_AUTH_CLIENT_ID'),
    clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
    redirectUri: oauthConfig.web.redirect_uris[0],
});

export const validateCode = async code => {
    const response = await googleOAuthClient.getToken(code);

    if (!response.tokens.id_token) {
        throw createHttpError(401, 'Unauthorized');
    }

    const ticket = await googleOAuthClient.verifyIdToken({
        idToken: response.tokens.id_token,
    });

    return ticket;
};

export const generateGoogleOAuthUrl = () => (
    googleOAuthClient.generateAuthUrl({
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
    })
);