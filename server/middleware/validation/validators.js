import mongoose from 'mongoose';
import validator from 'validator';
import * as yup from 'yup';
// eslint-disable-next-line import/no-named-as-default
import schemas from '../../validation/schemas/schemas.js';
//! NEEDS TESTING
// * Schema validators
const validators = {
  validateEventSchema: async (req, res, next) => {
    try {
      await schemas.eventSchema.validate(req.body);
    } catch (error) {
      res.status(400);
      return next(error);
    }
    const errors = [];

    if (!validator.isDate(new Date(req.body.date))) {
      res.status(400);
      errors.push(new Error('Please enter a valid date'));
    }

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      res.status(400);
      errors.push(new Error('Invalid user id'));
    }

    if (!validator.isPostalCode(req.body.location.zipCode, 'US')) {
      res.status(400);
      errors.push(new Error('Please enter a valid zipcode'));
    }

    if (errors.length > 0) return next(errors);

    return next();
  },
  // !!! yup attempts to coerce the value to the type specified in the schema, turn that off by using strict(true) on a specific field or globally on the validation options
  // eslint-disable-next-line consistent-return
  signUpSchema: async (req, res, next) => {
    try {
      const valid = await schemas.signUpSchema.validate(req.body);
      if (valid) return next();
    } catch (error) {
      res.status(400);
      return next(error);
    }
  },
  loginSchema: async (req, res, next) => {
    try {
      await schemas.loginSchema.validate(req.body);
      next();
    } catch (error) {
      res.status(400);
      next(error);
    }
  },
  validateAttendance: async (req, res, next) => {
    const validStatus = ['going', 'maybe'];
    const attendanceSchema = yup.object().shape({
      status: yup
        .string()
        .required('a property of status ios required')
        .typeError('status must be a string')
        .oneOf(validStatus, 'status must be either "going" or "maybe"'),
    }).required('status is required');

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      return next(new Error('Invalid Event ID'));
    }

    try {
      const valid = await attendanceSchema.validate(req.body, { strict: true });
      if (valid) return next();
    } catch (error) {
      res.status(400);
      return next(error);
    }
  },
};
export default validators;
