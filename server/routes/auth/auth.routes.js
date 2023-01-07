/* eslint-disable import/extensions */
import { Router } from 'express';
import authController from '../../controllers/auth/auth.controllers.js';
import validators from '../../middleware/validation/validators.js';

const router = Router();

router.post('/signup', validators.signUpSchema, authController.SignUp);

router.post('/login', validators.signUpSchema, authController.Login);
router.get('/verify/:token', authController.VerifyAccount);

export default router;
