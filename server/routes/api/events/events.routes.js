import { Router } from 'express';
import eventCont from '../../../controllers/api/events/events.controllers.js';
import validators from '../../../middleware/validation/validators.js';

const router = Router();

router
  .route('/')
  .get(eventCont.GetAllEvents)
  .post(validators.validateEventSchema, eventCont.CreateEvent);

router.route('/following').get(eventCont.GetFollowingEvents);

router.route('/:id').get(eventCont.GetSingleEvent);

router
  .route('/:id/attend')
  .put(eventCont.MarkAttendance)
  .delete(eventCont.DeleteAttendance);

export default router;
