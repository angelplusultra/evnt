import asyncHandler from 'express-async-handler';
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
    const hash = await helpers.hashPassword(password);

    const takenEmail = await Users.findOne({ email }).lean();

    if (takenEmail) throw new Error('User already exists with that email');

    const takenUsername = await Users.findOne({ username }).lean();

    if (takenUsername) throw new Error('User already exists with that username');

    const newUser = await Users.create({
      username,
      email,
      password: hash,
      isArtist,
      areaCode,
      activity: [{ activityDetails: 'Signed up' }],
    });

    newUser.password = undefined;

    res.status(201).json(newUser);
  }),
  // * @desc Authenticate user and send token
  // * @route POST /auth/login
  // * @access PUBLIC
  Login: asyncHandler(async (req, res) => {
    res.send('login');
  }),
};

export default controller;
