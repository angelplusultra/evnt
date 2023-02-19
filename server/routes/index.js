/* eslint-disable import/extensions */
import { Router } from 'express';
import apiRoutes from './api/api.routes.js';
import authRoutes from './auth/auth.routes.js';

const router = Router();

router.use('/api', apiRoutes);
router.use('/auth', authRoutes);

if (process.env.NODE_ENV === 'dev') {
  router.get('/error', (_, __, next) => {
    next(new Error('This is a test error'));
  });
}

router.all('*', (_, res) => {
  res.status(404);
  throw new Error('404');
});

export default router;
