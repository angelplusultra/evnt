/* eslint-disable import/extensions */
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import helpers from '../../helpers/helpers.js';
import Users from '../../models/Users.js';

const controller = {
  // * @desc Create a new User
  // * @route POST /auth/signup
  // * @access PUBLIC
  SignUp: asyncHandler(async (req, res) => {
    const {
      email,
      username,
      password,
      password2,
      isArtist,
      areaCode,
      locationTracking,
    } = req.body;

    helpers.signUpDataValidation(
      username,
      email,
      password,
      password2,
      areaCode,
      res,
    );

    const takenEmail = await Users.findOne({ email });

    if (takenEmail) {
      res.status(400);
      throw new Error('User already exists with that email');
    }

    const takenUsername = await Users.findOne({ username });

    if (takenUsername) {
      res.status(400);
      throw new Error('Username already taken');
    }

    const hash = await helpers.hashPassword(password, res);
    // eslint-disable-next-line max-len

    const newUser = new Users({
      username,
      email,
      password: hash,
      isArtist,
      areaCode,
      locationTracking,
      activity: [{ activityDetails: 'Signed up' }],
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      res.status(400);
      throw new Error('User could not be created');
    }

    savedUser.password = undefined;

    // eslint-disable-next-line no-underscore-dangle
    const verifyToken = helpers.genToken(savedUser._id);

    if (!verifyToken) {
      res.status(400);
      throw new Error('Email verification token could not be created');
    }

    const { NODE_ENV } = process.env;

    const transporter = nodemailer.createTransport({
      service: NODE_ENV === 'prod' ? 'gmail' : 'mailtrap',
      auth: {
        user: NODE_ENV === 'prod' ? 'evntweb@gmail.com' : '917368b2a7fa16',
        pass:
          NODE_ENV === 'prod' ? process.env.EMAIL_PASSWORD : 'a843cfe71f62ee',
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./views'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views/email'),
    };

    transporter.use('compile', hbs(handlebarOptions));

    const msg = {
      from: '"Evnt" <eventweb@gmail.com>',
      to: `${email}`,
      subject: 'Please verify account',
      template: 'email',
      context: {
        url: `http://localhost:5000/auth/verify/${verifyToken}`,
        user: username,
      },
    };

    const mail = await transporter.sendMail(msg);
    // ! Later on, make it so the user can resend the email if they didn't get it
    if (!mail) {
      res.status(400);
      throw new Error('Email could not be sent');
    }
    res.status(200).json({
      message:
        'You have successfully signed up. Please check your email to verify your account',
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

    if (!user) {
      res.status(400);
      throw new Error('User does not exist');
    }

    await helpers.comparePassword(password, user.password, res);

    // eslint-disable-next-line no-underscore-dangle
    const token = helpers.genToken(user._id);

    res.status(200).json({
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
      username: user.username,
      email: user.email,
      isArtist: user.isArtist,
      areaCode: user.areaCode,
      token,
    });
  }),
  VerifyAccount: asyncHandler(async (req, res) => {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    const user = await Users.findById(decoded.id).lean();

    if (!user) {
      res.status(400);
      throw new Error('User does not exist');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('User is already verified');
    }

    const updatedUser = await Users.findByIdAndUpdate(
      decoded.id,
      { isVerified: true },
      { new: true },
    );

    if (!updatedUser) {
      res.status(400);
      throw new Error('User could not be verified');
    }

    updatedUser.password = undefined;

    res
      .status(200)
      .json({ message: 'User verified successfully', user: updatedUser });
  }),
};

export default controller;
