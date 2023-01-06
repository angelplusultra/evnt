import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const helpers = {
  hashPassword: asyncHandler(async (password) => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    if (!hash) {
      throw new Error('Something went wrong');
    }
    return hash;
  }),

  signUpValidation: (username, email, password, password2, areaCode) => {
    if (!username || !email || !password || !password2) {
      throw new Error('Please fill in all fields');
    }
    if (!validator.isEmail(email)) {
      throw new Error('Please enter a valid email');
    }
    if (password !== password2) {
      throw new Error('Passwords do not match');
    }
    if (!validator.isPostalCode(areaCode, 'US')) {
      throw new Error('Please enter a valid area code');
    }
    return {
      username, email, password, password2, areaCode,
    };
  },
  loginValidation: (email, password) => {
    if (!email || !password) {
      throw new Error('Please fill in all fields');
    }
    return true;
  },

  comparePassword: asyncHandler(async (password, hash) => {
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) {
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
    state, city, address, zipcode,
  }, date, genre, lineup, attendance, res) => {
    // eslint-disable-next-line max-len
    console.log(title, host, state, city, address, zipcode, date, genre, lineup, attendance);

    // eslint-disable-next-line max-len
    if (!title || !host || !state || !city || !address || !zipcode || !date || !genre || !lineup || !attendance) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }
    if (!validator.isPostalCode(zipcode, 'US')) {
      res.status(400);
      throw new Error('Please enter a valid zipcode');
    }

    return true;
  },

};

export default helpers;
