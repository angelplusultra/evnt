import * as yup from 'yup';

// * Schema validators
const validators = {
  validateEvent: async (req, res, next) => {
    const eventSchema = yup.object().shape({
      title: yup.string('title must be a string').required('title is required').typeError('title must be a string'),
      host: yup.string().required(),
      location: yup.object().shape({
        state: yup.string('State must be a string').required('State is required').typeError('State must be a string'),
        city: yup.string().required('city is required').typeError('city must be a string'),
        address: yup.string().required(),
        zipCode: yup.string().required(),
      }).typeError('Location must be an object'),
      date: yup.date().required('date is required').typeError('date must be a date'),
      genre: yup.string().required('genre is required').typeError('genre must be a string'),
      lineup: yup.array().of(yup.string()).required('lineup is required').typeError('lineup must be an array')
        .min(1, 'lineup must have at least one artist'),
      attendance: yup.array().of(yup.object().shape({
        user: yup.string().required(),
        status: yup.string().required(),
      })).required(),
    });
    try {
      await eventSchema.validate(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
};
export default validators;
