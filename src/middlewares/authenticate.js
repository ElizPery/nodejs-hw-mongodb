import createHttpError from "http-errors";
import * as authServices from "../services/auth.js";
const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next(createHttpError(401, 'Authorization header is not found'));
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer') {
        return next(createHttpError(401, 'Authorization header must have Bearer type'));
    }

    const session = await authServices.findSessionByAccessToken(token);
    if (!session) {
        return next(createHttpError(401, 'Session not found'));
    }

    if (new Date() > session.accessTokenValidUntil) {
        return next(createHttpError(401, 'Access token expired'));
    };

    const user = await authServices.findUser(session.userId);
    if (!user) {
        return next(createHttpError(401, 'User not found'));
    }
    
    req.user = user;
    next();
};
export default authenticate;