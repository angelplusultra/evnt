import * as yup from 'yup';

// * Schema validators
const validators = {
  validateEventSchema: async (req, res, next) => {
    const eventSchema = yup.object().shape({
      title: yup
        .string('title must be a string')
        .required('title is required')
        .typeError('title must be a string'),
      host: yup.string().required(),
      location: yup
        .object()
        .shape({
          state: yup
            .string('State must be a string')
            .required('State is required')
            .typeError('State must be a string'),
          city: yup
            .string()
            .required('city is required')
            .typeError('city must be a string'),
          address: yup.string().required(),
          zipCode: yup.string().required(),
        })
        .typeError('Location must be an object'),
      date: yup
        .date()
        .required('date is required')
        .typeError('date must be a date'),
      genre: yup
        .string()
        .required('genre is required')
        .typeError('genre must be a string'),
      lineup: yup
        .array()
        .of(yup.string())
        .required('lineup is required')
        .typeError('lineup must be an array')
        .min(1, 'lineup must have at least one artist'),
      attendance: yup
        .array()
        .of(
          yup.object().shape({
            user: yup
              .string()
              .required('An event must have at least one attendee, user is required')
              .typeError('user must be a string'),
            status: yup
              .string()
              .required('status is required, must be "going"')
              .typeError('status must be a string'),
          }),
        )
        .required('attendance is required')
        .typeError('attendance must be an array'),
    });

    try {
      await eventSchema.validate(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  signUpSchema: async (req, res, next) => {
    const signUpSchema = yup.object().shape({
      username: yup
        .string()
        .required('name is required')
        .typeError('name must be a string'),
      email: yup
        .string()
        .email('email must be a valid email')
        .required('email is required')
        .typeError('email must be a string'),
      password: yup
        .string()
        .required('password is required')
        .typeError('password must be a string'),
      password2: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    });

    try {
      await signUpSchema.validate(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  loginSchema: async (req, res, next) => {
    const loginSchema = yup.object().shape({
      emailOrUsername: yup
        .string()
        .required('emailOrUsername is required')
        .typeError('emailOrUSername must be a string'),
      password: yup
        .string()
        .required('password is required')
        .typeError('password must be a string'),
    });

    try {
      await loginSchema.validate(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
};
export default validators;
