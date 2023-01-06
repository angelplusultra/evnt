import { Router } from 'express';
// eslint-disable-next-line import/extensions
import apiController from '../../../controllers/api/api.controllers.js'

const router = Router();

router.route('/:id')
  .put(apiController.FollowUser);
router.get('/activity', apiController.GetActivity);

export default router;
