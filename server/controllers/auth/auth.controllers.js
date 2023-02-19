/* eslint-disable import/extensions */
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import helpers from "../../helpers/helpers.js";
import Users from "../../models/Users.js";

const controller = {
  // * @desc Create a new User
  // * @route POST /auth/signup
  // * @access PUBLIC
  SignUp: asyncHandler(async (req, res) => {
    const {
      email,
      isArtist,
      username,
      password,
      password2,
      areaCode,
      locationTracking,
      artistName,
    } = req.body;

    const parsedIsArtist = JSON.parse(isArtist);

    helpers.signUpDataValidation(
      username,
      email,
      password,
      password2,
      areaCode,
      res
    );

    if (await Users.findOne({ email })) {
      res.status(400);
      throw new Error("Email not available");
    }
    if (await Users.findOne({ username })) {
      res.status(400);
      throw new Error("Username not available");
    }

    const hash = await helpers.hashPassword(password, res);

    const userID = new mongoose.Types.ObjectId();
    const newUser = new Users({
      _id: userID,
      username,
      email,
      password: hash,
      isArtist,
      areaCode,
      locationTracking,
      artistName: parsedIsArtist ? artistName : undefined,
      ...(parsedIsArtist && { performingEvents: [] }),
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
  // * @desc Authenticate user and send token
  // * @route POST /auth/login
  // * @access PUBLIC
  Login: asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;

    const user = await Users.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      res.status(400);
      throw new Error("User does not exist");
    }
    await helpers.comparePassword(password, user.password, res);

    // eslint-disable-next-line no-underscore-dangle
    const token =  helpers.genToken(user._id);
    user.password = undefined;
    res.status(200).json({
      token,
      user,
    });
  }),

  VerifyAccount: asyncHandler(async (req, res) => {
    const { token } = req.params;
    
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await Users.findById(decoded.id).lean();
    if (!user) {
      res.status(400);
      throw new Error("User does not exist");
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error("You are already verified");
    }

    const updatedUser = await Users.findByIdAndUpdate(
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
