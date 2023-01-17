import * as yup from 'yup';

const schemas = {
  eventSchema: yup.object().shape({
    title: yup
      .string('title must be a string')
      .required('title is required')
      .typeError('title must be a string'),
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
        zipCode: yup.string().required().typeError('zipCode field must be a string').strict(true),
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
  }),
  signUpSchema: yup.object().shape({
    username: yup
      .string()
      .required('username is required')
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
    password2: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    isArtist: yup.boolean().required('isArtist is required').typeError('isArtist must be a boolean'),
    areaCode: yup.string().required('areaCode is required').typeError('areaCode must be a string'),

    // ! WHY IS THIS NOT WORKING, VALIDATION OF DATA INSIDE ARRAY ISNT WORKING?
    locationTracking: yup
      .array()
      .of(yup.string().required('locationTracking is required').typeError('locationTrackings must be a string'))
      .required('locationTracking is required')
      .typeError('locationTracking must be an array')
      .min(1, 'locationTracking must have at least one location')
      .strict(true),

  }),
  loginSchema: yup.object().shape({
    emailOrUsername: yup
      .string()
      .required('emailOrUsername is required')
      .typeError('emailOrUSername must be a string'),
    password: yup
      .string()
      .required('password is required')
      .typeError('password must be a string'),
  }),
  attendanceSchema: yup.object().shape({
    status: yup
      .string()
      .required('a property of status ios required')
      .typeError('status must be a string')
      .oneOf(['going', 'maybe'], 'status must be either "going" or "maybe"'),
  }).required('status is required'),

};

export default schemas;
