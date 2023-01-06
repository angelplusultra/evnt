import { Router } from 'express';
// eslint-disable-next-line import/extensions
import apiController from '../../controllers/api/api.controllers.js';
import authorize from '../../middleware/authorize.js';
import verifyCheck from '../../middleware/verifyCheck.js';

const router = Router();

router.use(authorize);
router.use(verifyCheck);
router.route('/events')
  .get(apiController.GetEvents)
  .post(apiController.CreateEvent);

router.get('/activity', apiController.GetActivity);

router.post('/email', apiController.SendEmail);

export default router;
