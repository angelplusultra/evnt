import fileUpload from "express-fileupload";

  
const uploadPoster = fileUpload({
  limits: { fileSize: 1 * 1024 * 1024 },
  abortOnLimit: true,
  limitHandler: (_, res, next) => {
    res.status(400);
    next(new Error('File size is too big'));
  },

});

export default uploadPoster;
