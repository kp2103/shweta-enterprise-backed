import {Router} from 'express'
import * as authController from '../controllers/auth/index.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register',authController.register)
authRouter.post('/login',authController.login)
authRouter.get('/me',authMiddleware,authController.me)
authRouter.post('/refresh',authController.refreshTokens)
authRouter.post('/logout',authMiddleware,authController.logout)

export default authRouter