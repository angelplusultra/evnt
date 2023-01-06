import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const helpers = {
  hashPassword: asyncHandler(async (password, res) => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    if (!hash) {
      res.status(500);
      throw new Error('Something went wrong');
    }
    return hash;
  }),

  signUpValidation: (username, email, password, password2, areaCode, res) => {
    if (!username || !email || !password || !password2) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }
    if (!validator.isEmail(email)) {
      res.status(400);
      throw new Error('Please enter a valid email');
    }
    if (password !== password2) {
      res.status(400);
      throw new Error('Passwords do not match');
    }
    if (!validator.isPostalCode(areaCode, 'US')) {
      res.status(400);
      throw new Error('Please enter a valid area code');
    }
    return {
      username, email, password, password2, areaCode,
    };
  },
  loginValidation: (email, password, res) => {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }
    return true;
  },

  comparePassword: asyncHandler(async (password, hash, res) => {
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) {
      res.status(400);
      throw new Error('Invalid credentials');
    }
    return isMatch;
  }),

  genToken: (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  },

  eventValidator: (title, host, {
    state, city, address, zipCode,
  }, date, genre, lineup, attendance, res) => {
    // eslint-disable-next-line max-len

    // eslint-disable-next-line max-len
    if (!title || !host || !state || !city || !address || !zipCode || !date || !genre || !lineup || !attendance) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }
    if (!validator.isPostalCode(zipCode, 'US')) {
      res.status(400);
      throw new Error('Please enter a valid zipcode');
    }

    return true;
  },

};

export default helpers;
