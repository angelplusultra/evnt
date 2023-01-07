import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import yup from 'yup';

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

  eventValidator: async (title, host, {
    state, city, address, zipCode,
  }, date, genre, lineup, attendance, res) => {
    // eslint-disable-next-line max-len

    // eslint-disable-next-line max-len
    // if (!title || !host || !state || !city || !address || !zipCode || !date || !genre || !lineup || !attendance) {
    //   res.status(400);
    //   throw new Error('Please fill in all required fields');
    // }
    console.log(typeof zipCode);
    if (!Array.isArray(lineup)) {
      res.status(400);
      throw new Error('Lineup must be an array');
    }
    if (!Array.isArray(attendance)) {
      res.status(400);
      throw new Error('Attendance must be an array');
    }
    if (attendance.length === 0) {
      res.status(400);
      throw new Error('Attendance must have at least one attendee');
    }

    if (lineup.length === 0) {
      res.status(400);
      throw new Error('Lineup must have at least one artist');
    }

    // validate that the location is an object and has the required fields with yup

    const locationSchema = yup.object().shape({
      state: yup.string().required('yo u need a state nigga'),
      city: yup.string().required(),
      address: yup.string().required('yo an address is required'),
      zipCode: yup.string('Zip code must be a string').required().typeError('Zip code must be a string'),
    });
    try {
      await locationSchema.validate({
        state, city, address, zipCode,
      });
    } catch (error) {
      console.log(error.message);
    }

    const { user, status } = attendance[0];
    console.log(attendance);
    const validStatus = ['going'];

    if (!user || !status) {
      res.status(400);
      throw new Error('A new event must have at least one attendee, please fill in all required fields');
    }

    const formattedStatus = status.toLowerCase();

    if (!validStatus.includes(formattedStatus)) {
      res.status(400);
      throw new Error('A new event must have at least one attendee with the status of "Going", please fill in all required fields');
    }

    if (!validator.isDate(new Date(date))) {
      res.status(400);
      throw new Error('Please enter a valid date');
    }
    if (!mongoose.Types.ObjectId.isValid(host)) {
      res.status(400);
      throw new Error('Invalid host id');
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      res.status(400);
      throw new Error('Invalid attendant id');
    }

    if (!validator.isPostalCode(zipCode, 'US')) {
      res.status(400);
      throw new Error('Please enter a valid zipcode');
    }

    return true;
  },

};

export default helpers;
