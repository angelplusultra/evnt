import { Router } from "express";
// eslint-disable-next-line import/extensions
import userCont from "../../../controllers/api/users/users.controllers.js";
import validators from "../../../middleware/validation/validators.js";
import uploadProfileImage from "../../../middleware/upload/express_fileupload.js";

const router = Router();

router.route("/").get(userCont.GetAllUsers);

router.get("/me", userCont.GetMe);

router.post(
  "/me/profileimage",
  uploadProfileImage,
  validators.validateProfileImage,
  userCont.UploadSingleProfilePicture
);
router
  .put("/me/profileimage/:id", userCont.ChangeProfileImage)
  .delete("/me/profileImage/:id", userCont.DeleteProfileImage);

router.get("/activity", userCont.GetActivity);

router.route("/followers").get(userCont.GetFollowers);
// router.route('/following').get(apiController.GetWhoIAmFollowing);

router.route("/:id").put(userCont.FollowUser).get(userCont.GetSingleUser);

export default router;
