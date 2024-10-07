import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import * as validationUserSchemas from "../validation/users.js";
import * as authControllers from "../controllers/auth.js";

const authRouter = Router();

authRouter.post('/register', validateBody(validationUserSchemas.userRegistrationSchema), ctrlWrapper(authControllers.registerController));
authRouter.get('/get-google-oauth-url', ctrlWrapper(authControllers.getGoogleOAuthUrlController));
authRouter.post('/confirm-google-auth', validateBody(validationUserSchemas.userLoginWithGoogle), ctrlWrapper(authControllers.loginGoogleAuthController));
authRouter.post('/login', validateBody(validationUserSchemas.userLoginSchema), ctrlWrapper(authControllers.loginController));
authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));
authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));
authRouter.post('/send-reset-email', validateBody(validationUserSchemas.requestResetEmailSchema), ctrlWrapper(authControllers.requestResetEmailController));
authRouter.post('/reset-pwd', validateBody(validationUserSchemas.resetPasswordSchema), ctrlWrapper(authControllers.resetPasswordController));

export default authRouter;