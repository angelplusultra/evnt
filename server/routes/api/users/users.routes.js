import { Router } from 'express';
// eslint-disable-next-line import/extensions
import userCont from '../../../controllers/api/users/users.controllers.js';

const router = Router();

router.route('/').get(userCont.GetAllUsers);

router.get('/me', userCont.GetMe);

router.get('/activity', userCont.GetActivity);

router.route('/followers').get(userCont.GetFollowers);
// router.route('/following').get(apiController.GetWhoIAmFollowing);

router
  .route('/:id')
  .put(userCont.FollowUser)
  .get(userCont.GetSingleUser);

export default router;
