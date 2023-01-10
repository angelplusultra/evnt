import { Router } from 'express';
// eslint-disable-next-line import/extensions
import apiController from '../../../controllers/api/api.controllers.js';

const router = Router();

router.route('/').get(apiController.GetAllUsers);

router.get('/me', apiController.GetMe);

router.get('/activity', apiController.GetActivity);

router.route('/followers').get(apiController.GetFollowers);
// router.route('/following').get(apiController.GetWhoIAmFollowing);

router
  .route('/:id')
  .put(apiController.FollowUser)
  .get(apiController.GetSingleUser);



export default router;
