import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import validator from 'validator';

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

};

export default helpers;
