import { Router } from 'express';
import apiController from '../../../controllers/api/api.controllers.js';
import validators from '../../../middleware/validators.js';
const router = Router();

router.route('/')
  .get(apiController.GetAllEvents)
  .post(validators.validateEvent, apiController.CreateEvent);

router.route('/following')
  .get(apiController.GetFollowingEvents);

router.route('/:id')
  .get(apiController.GetEvent);

router.route('/:id/attend')
  .put(apiController.MarkAttendance)
  .delete(apiController.DeleteAttendance);

export default router;
