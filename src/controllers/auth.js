import * as authServices from '../services/auth.js';

export const registerController = async (req, res) => {
    const newUser = await authServices.register(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully register a user',
        data: newUser,
    });
};

export const loginController = async (req, res) => {
    const userSession = await authServices.login(req.body);

    res.cookie('refreshToken', userSession.refreshToken, {
        httpOnly: true,
        expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
    });

    res.cookie('sessionId', userSession._id, {
        httpOnly: true,
        expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
    });

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: userSession.accessToken,
        }
    });
};