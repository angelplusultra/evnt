/* eslint-disable import/extensions */
import { Router } from 'express';
import apiRoutes from './api/api.routes.js';
import authRoutes from './auth/auth.routes.js';

const router = Router();

router.use('/api', apiRoutes);
router.use('/auth', authRoutes);
router.get('/drones', (req, res) => {
  res.send(req.query);
});

router.all('*', (req, res) => {
  res.status(404);
  throw new Error('404');
});

export default router;
