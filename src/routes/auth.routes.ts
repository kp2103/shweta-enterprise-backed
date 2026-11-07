import { Router } from 'express';
import * as authController from '../controllers/auth/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { apiBodyValidator } from '../middlewares/validators/index.js';
import {
    registerBodySchema,
    loginBodySchema,
    refreshTokensBodySchema,
} from '../api-schemas/auth.schemas.js';

const authRouter = Router();

authRouter.post(
    '/register',
    apiBodyValidator(registerBodySchema),
    authController.register,
);

authRouter.post(
    '/login',
    apiBodyValidator(loginBodySchema),
    authController.login,
);

authRouter.get(
    '/me',
    authMiddleware,
    authController.me,
);

authRouter.post(
    '/refresh',
    apiBodyValidator(refreshTokensBodySchema),
    authController.refreshTokens,
);

authRouter.post(
    '/logout',
    authMiddleware,
    authController.logout,
);

authRouter.get(
    '/roles',
    authController.getUsersRoles,
);

export default authRouter;
