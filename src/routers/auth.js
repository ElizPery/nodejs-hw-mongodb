import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { userRegistrationSchema, userLoginSchema } from "../validation/users.js";
import * as authControllers from "../controllers/auth.js";

const authRouter = Router();

authRouter.post('/register', validateBody(userRegistrationSchema), ctrlWrapper(authControllers.registerController));
authRouter.post('/login', validateBody(userLoginSchema), ctrlWrapper(authControllers.loginController));
authRouter.post('/refresh',ctrlWrapper(authControllers.refreshController));

export default authRouter;