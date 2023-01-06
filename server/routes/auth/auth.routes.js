/* eslint-disable import/extensions */
import { Router } from 'express';
import authController from '../../controllers/auth/auth.controllers.js';

const router = Router();

router.post('/signup', authController.SignUp);

router.post('/login', authController.Login);
router.get('/verify/:token', authController.VerifyAccount);

export default router;
