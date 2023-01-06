/* eslint-disable import/extensions */
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import axios from 'axios';
import helpers from '../../helpers/helpers.js';
import Users from '../../models/Users.js';

const controller = {
  // * @desc Create a new User
  // * @route POST /auth/signup
  // * @access PUBLIC
  SignUp: asyncHandler(async (req, res) => {
    const {
      email, username, password, password2, isArtist, areaCode,
    } = req.body;

    helpers.signUpValidation(username, email, password, password2, areaCode);

    const takenEmail = await Users.findOne({ email }).lean();

    if (takenEmail) throw new Error('User already exists with that email');

    const takenUsername = await Users.findOne({ username }).lean();

    if (takenUsername) throw new Error('User already exists with that username');

    const hash = await helpers.hashPassword(password);
    // ! This is where the error is coming from, api call is not working because we exceeded the limit of 10 calls per hour
    //     const locationData = await axios.get(`https://service.zipapi.us/zipcode/county/92870?X-API-KEY=${process.env.ZIP_API_KEY}`);

    // if(!locationData) throw new Error('Invalid location data');

    // if(locationData.data.data.county.length === 0) throw new Error('Invalid location data')

    //     const { county: counties } = locationData.data.data;

    //     console.log(locationData.data);

    const newUser = new Users({
      username,
      email,
      password: hash,
      isArtist,
      areaCode,
      activity: [{ activityDetails: 'Signed up' }],
    });

    // counties.forEach((county) => {
    //   newUser.locationTracking.push(county);
    // });

    newUser.save();

    if (!newUser) throw new Error('Invalid user');

    res.status(201).json({ message: 'User created successfully, please verify your account', user: newUser });

    const verifyToken = helpers.genToken(newUser._id);

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'evntapp@outlook.com', // generated ethereal user
        pass: 'tillery1', // generated ethereal password
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

    // send mail with defined transport object
    const msg = {
      from: '"Evnt" <evntapp@outlook.com>', // sender address
      to: `${email}`, // list of receivers
      subject: 'Please verify account', // Subject line
      // text: 'Please verify your account by clicking on', // plain text body
      // html: `<b>Please verify your account by clicking the link below</b><a href=http://localhost:5000/auth/verify/${verifyEndpoint}>http://localhost:5000/auth/${verifyEndpoint}</a>`, // html body
      template: 'email',

      context: {
        url: `http://localhost:5000/auth/verify/${verifyToken}`,
        user: username,
      },

    };

    const info = await transporter.sendMail(msg);
    //! Later on, make it so the user can resend the email if they didn't get it
    if (!info) console.log('Email not sent');
  }),

  // * @desc Validate form, Authenticate user and send token
  // * @route POST /auth/login
  // * @access PUBLIC
  Login: asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;

    helpers.loginValidation(emailOrUsername, password);

    const user = await Users
      .findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).lean();

    if (!user) throw new Error('User does not exist');

    await helpers.comparePassword(password, user.password);

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

    if (!user) throw new Error('User does not exist');

    if (user.isVerified) throw new Error('User is already verified');

    const updatedUser = await Users
      .findByIdAndUpdate(decoded.id, { isVerified: true }, { new: true });

    if (!updatedUser) throw new Error('User could not be verified');

    res.status(200).json({ message: 'User verified successfully', user: updatedUser });
  }),
};

export default controller;
