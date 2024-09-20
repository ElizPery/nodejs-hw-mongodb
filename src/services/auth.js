import bcrypt from 'bcrypt';
// import { randomBytes } from 'crypto';

import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/User.js";
// import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/users.js';
// import { SessionCollection } from '../db/models/Session.js';

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