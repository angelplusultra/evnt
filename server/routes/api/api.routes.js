import { Router } from 'express';
// eslint-disable-next-line import/extensions
import authorize from '../../middleware/authorize.js';
import verifyCheck from '../../middleware/verifyCheck.js';
import eventRouter from './events/events.routes.js';
import userRouter from './users/users.routes.js';

const router = Router();

router.use(authorize);

router.use(verifyCheck);

router.use('/events', eventRouter);
router.use('/users', userRouter);

export default router;
