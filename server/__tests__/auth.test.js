import authController from '../controllers/auth/auth.controllers.js';
import Users from '../models/Users.js';
/* eslint-disable */

jest.mock('../../../models/Users.js');


it('should create a new user', async () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    
    const mockUser = {
        username: 'username',
        email: 'test@test.com',
        password: '123456',
        password2: '123456',
        isArtist: false,
        areaCode: '92808',
        locationTracking: ["New York", "Orange"],
        activity: [{ activityDetails: 'Signed up' }]

    }
    
    const req = {
        body: mockUser
    };

    await Users.create.mockResolvedValue({
        username: 'username',
        email: 'test@test.com',
        password: '123456',
        isArtist: false,   
        areaCode: '92808',
        locationTracking: ["New York", "Orange"],
        activity: [{ activityDetails: 'Signed up' }]           
    });

    await authController.SignUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser

    });

});