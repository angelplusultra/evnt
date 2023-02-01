/* eslint-disable import/extensions */
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import helpers from "../../helpers/helpers.js";
import Artists from "../../models/Artists.js";
import Users from "../../models/Users.js";

const controller = {
 // * @desc Create a new User
 // * @route POST /auth/signup
 // * @access PUBLIC
 SignUp: asyncHandler(async (req, res) => {
  const { email, username, password, password2, areaCode, locationTracking } =
   req.body;

  helpers.signUpDataValidation(
   username,
   email,
   password,
   password2,
   areaCode,
   res
  );

  if ((await Users.findOne({ email })) || (await Artists.findOne({ email }))) {
   res.status(400);
   throw new Error("Email not available");
  }
  if (
   (await Users.findOne({ username })) ||
   (await Artists.findOne({ username }))
  ) {
   res.status(400);
   throw new Error("Username not available");
  }

  const hash = await helpers.hashPassword(password, res);

  const userID = new mongoose.Types.ObjectId();
  const newUser = new Users({
   username,
   email,
   password: hash,
   isArtist: false,
   areaCode,
   locationTracking,
   activity: [{ activityDetails: `${userID} joined Evnt!`, user: userID }],
  });

  const savedUser = await newUser.save();

  if (!savedUser) {
   res.status(400);
   throw new Error("User could not be created");
  }

  savedUser.password = undefined;

  // eslint-disable-next-line no-underscore-dangle
  const verifyToken = helpers.genToken(savedUser._id);

  if (!verifyToken) {
   res.status(400);
   throw new Error("Email verification token could not be created");
  }
  await helpers.genEmail({ username, email, res, verifyToken });

  res.status(200).json({
   message:
    "You have successfully signed up. Please check your email to verify your account",
  });
 }),
 ArtistSignUp: asyncHandler(async (req, res) => {
  // REFACTOR AUTHENTIOCATION FOR USERS & ARTISTS, USERNAMES AND EMAILS MUST BE UNQIUE TO BOTH ENDS
  const {
   email,
   username,
   password,
   password2,
   artistName,
   areaCode,
   locationTracking,
  } = req.body;
  // !!refactor this as middleware
  helpers.signUpDataValidation(
   username,
   email,
   password,
   password2,
   areaCode,
   res
  );

  if ((await Artists.findOne({ email })) || (await Users.findOne({ email }))) {
   res.status(400);
   throw new Error("Email not available");
  }
  if (
   (await Artists.findOne({ username })) ||
   (await Users.findOne({ username }))
  ) {
   res.status(400);
   throw new Error("Username not available");
  }

  const hash = await helpers.hashPassword(password, res);
  // eslint-disable-next-line max-len
  const userID = new mongoose.Types.ObjectId();

  const newArtist = new Artists({
   _id: userID,
   username,
   email,
   password: hash,
   isArtist: true,
   areaCode,
   locationTracking,
   artistName,
   activity: [{ activityDetails: `${userID} joined Evnt!`, user: userID }],
  });
  const savedArtist = await newArtist.save();

  if (!savedArtist) {
   res.status(500);
   throw new Error("Something went wrong with registration");
  }
  const verifyToken = helpers.genToken(savedArtist._id);

  if (!verifyToken) {
   res.status(400);
   throw new Error("Email verification token could not be created");
  }
  await helpers.genEmail({ username, email, res, verifyToken });

  res.status(200).json({
   message:
    "You have successfully signed up. Please check your email to verify your account",
  });
 }),

 // * @desc Validate form, Authenticate user and send token
 // * @route POST /auth/login
 // * @access PUBLIC
 Login: asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await Users.findOne({
   $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  const artist = await Artists.findOne({
   $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user && !artist) {
   res.status(400);
   throw new Error("User does not exist");
  }
  await helpers.comparePassword(
   password,
   user ? user.password : artist.password,
   res
  );

  // eslint-disable-next-line no-underscore-dangle
  const token = helpers.genToken(user ? user._id : artist._id);

  if (user) {
   user.password = undefined;
  } else {
   artist.password = undefined;
  }

  res.status(200).json({
   token,
   ...(user && { user: user }),
   ...(artist && { artist: artist }),
  });
 }),

 VerifyAccount: asyncHandler(async (req, res) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
  const genUser = await Users.findById(decoded.id).lean();
  const artist = await Artists.findById(decoded.id).lean();
  if (!genUser && !artist) {
   res.status(400);
   throw new Error("User does not exist");
  }

  if ((genUser ? genUser : artist).isVerified) {
   res.status(400);
   throw new Error("You are already verified");
  }

  const updatedUser = await (genUser ? Users : Artists).findByIdAndUpdate(
   decoded.id,
   { isVerified: true },
   { new: true }
  );

  if (!updatedUser) {
   res.status(400);
   throw new Error("User could not be verified");
  }

  updatedUser.password = undefined;

  res
   .status(200)
   .json({ message: "User verified successfully", user: updatedUser });
 }),
};

export default controller;
