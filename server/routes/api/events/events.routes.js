import { Router } from 'express';
import apiController from '../../../controllers/api/api.controllers.js';

const router = Router();

router.route('/')
  .get(apiController.GetAllEvents)
  .post(apiController.CreateEvent);

router.route('/following')
  .get(apiController.GetFollowingEvents);

router.route('/:id')
  .get(apiController.GetEvent);
export default router;
