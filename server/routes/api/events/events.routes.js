import { Router } from 'express';
import apiController from '../../../controllers/api/api.controllers.js';
import validators from '../../../middleware/validation/validators.js';

const router = Router();

router
  .route('/')
  .get(apiController.GetAllEvents)
  .post(validators.validateEventSchema, apiController.CreateEvent);

router.route('/following').get(apiController.GetFollowingEvents);

router.route('/:id').get(apiController.GetSingleEvent);

router
  .route('/:id/attend')
  .put(apiController.MarkAttendance)
  .delete(apiController.DeleteAttendance);

export default router;
