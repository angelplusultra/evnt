import authController from '../controllers/auth/auth.controllers.js';
import Users from '../models/Users.js';
/* eslint-disable */

jest.mock('../models/Users.js');


const res = {
    status: jest.fn(x => x),
    json: jest.fn(x => x),
};
const next = jest.fn(x => x);

describe('SignUp', () => {
    it('should set a status code of 400 and throw an error over an already existing email', async () => {
        const req = {
            body: {
            email: 'test@test.com',
            username: 'test',
            password: 'test',
            password2: 'test',
            isArtist: false,
            areaCode: '12345',
            locationTracking: ["Orange", "Los Angeles"],
            },
        }
        
    Users.findOne.mockImplementationOnce(() => ({
        email: req.body.email,
    }));
    
    await authController.SignUp(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error('User already exists with that email'));
    
    });
    it('should set a status code of 400 and throw an error over an already existing username', async () => {
        const req = {
            body: {
            email: 'test10@test.com',
            username: 'macfittondev',
            password: 'test',
            password2: 'test',
            isArtist: false,
            areaCode: '12345',
            locationTracking: ["Orange", "Los Angeles"],
            },
        }
        
    Users.findOne.mockImplementationOnce(() => ({
        username: req.body.username,
    }));
    
    await authController.SignUp(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error('User already exists with that email'));
    
    });

});

describe('Login', () => {
    it('should set a status code of 400 and throw an error over an incorrect password', async () => {
        const req = {
            body: {
            emailOrUsername: 'macfittondev',
            password: 'test',
            },
        }

        Users.findOne.mockImplementationOnce(() => ({
            emailOrUsername: req.body.emailOrUsername,
            password: 'test2',
        }))

        await authController.Login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).toHaveBeenCalledWith(new Error('Invalid credentials'));

    })

})



