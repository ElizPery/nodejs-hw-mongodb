import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/User.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/users.js';
import { SessionCollection } from '../db/models/Session.js';

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

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
    const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

    const userSession = await SessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    return userSession;
};