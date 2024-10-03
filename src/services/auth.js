import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/User.js';
import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/users.js';
import { SessionCollection } from '../db/models/Session.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP } from '../constants/index.js';

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
    const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);
    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    };
};

export const register = async (payload) => { 
    const { email, password } = payload;
    const user = await UsersCollection.findOne({ email });
    if (user) {
        throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await UsersCollection.create({...payload, password: hashedPassword});
    delete data._doc.password;

    return data;
};

export const login = async (payload) => {
    const { email, password } = payload;
    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password invalid');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, 'Email or password invalid');
    }

    await SessionCollection.deleteOne({ userId: user._id });

    const sessionData = createSession();

    const userSession = await SessionCollection.create({
        userId: user._id,
        ...sessionData,
    });

    return userSession;
};

export const findSessionByAccessToken = accessToken => SessionCollection.findOne({ accessToken });

export const findUser = filter => UsersCollection.findOne(filter);

export const refreshSession = async ({ refreshToken, sessionId }) => {
    const oldSession = await SessionCollection.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!oldSession) {
        throw createHttpError(401, 'Session not found');
    }

    if (new Date() > oldSession.refreshTokenValidUntil) {
        throw createHttpError(401, 'Refresh token expired');
    }

    await SessionCollection.deleteOne({ _id: sessionId });

    const sessionData = createSession();

    const userSession = await SessionCollection.create({
        userId: oldSession._id,
        ...sessionData
    });

    return userSession;
};

export const logout = async (sessionId) => {
    await SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
    const user = await UsersCollection.findOne({ email });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email
        },
        env('JWT_SECRET'),
        {
            expiresIn: '5m',
        },
    );

    await sendEmail({
        from: env(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="https://${env('APP_DOMAIN')}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
};