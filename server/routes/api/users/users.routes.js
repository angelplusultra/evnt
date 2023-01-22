import { Router } from 'express';
import fileUpload from 'express-fileupload';
// eslint-disable-next-line import/extensions
import userCont from '../../../controllers/api/users/users.controllers.js';
import validators from '../../../middleware/validation/validators.js';

const router = Router();

router.route('/').get(userCont.GetAllUsers);

router.get('/me', userCont.GetMe);

router.post('/me/profileimage', fileUpload(), validators.validateProfileImage, userCont.UploadSingleProfilePicture);

router.get('/activity', userCont.GetActivity);

router.route('/followers').get(userCont.GetFollowers);
// router.route('/following').get(apiController.GetWhoIAmFollowing);

router
  .route('/:id')
  .put(userCont.FollowUser)
  .get(userCont.GetSingleUser);

export default router;
