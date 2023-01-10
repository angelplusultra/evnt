import * as yup from 'yup';

const schemas = {
    signUpSchema: yup.object().shape({
        username: yup
            .string()
            .required('Username is required')
            .typeError('name must be a string'),
        email: yup
            .string()
            .email('Must be a valid email')
            .required('Email is required')
            .typeError('Email must be string'),

        password: yup
        .string()
        .required('Password is required')
        .typeError('Password must be a string')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters'),

        password2: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required')
        .typeError('Password confirmation must be a string'),

        // isArtist: yup.boolean().required('isArtist is required').typeError('isArtist must be a boolean'),
        // areaCode: yup.string().required('areaCode is required').typeError('areaCode must be a string'),
        // locationTracking: yup.array().of(yup.string().required('locationTracking is required').typeError('locationTrackings must be a string')).required('locationTracking is required').typeError('locationTracking must be an array').min(1, 'locationTracking must have at least one location').strict(true),

    }),


};

export default schemas;