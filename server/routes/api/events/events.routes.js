import { Router } from 'express';
import eventCont from '../../../controllers/api/events/events.controllers.js';
import validators from '../../../middleware/validation/validators.js';
import uploadPoster from '../../../middleware/upload/poster_upload.js';
const router = Router();

router
  .route('/')
  .get(eventCont.GetAllEvents)
  .post(uploadPoster, validators.validateEventSchema, eventCont.CreateEvent);

router.route('/following').get(eventCont.GetFollowingEvents);

router.route('/:id').get(eventCont.GetSingleEvent);

router
  .route('/:id/attend')
  .put(validators.validateAttendance, eventCont.MarkAttendance)
  .delete(eventCont.DeleteAttendance);

export default router;
