import authController from '../controllers/auth/auth.controllers.js';
import Users from '../models/Users.js';
import validators from '../middleware/validation/validators.js';
import helpers from '../helpers/helpers.js';
/* eslint-disable */

jest.mock("../models/Users.js");

jest.mock('../helpers/helpers.js')


const res = {
  status: jest.fn((x) => x),
  json: jest.fn((x) => x),
};
const next = jest.fn((x) => x);

describe("SignUp", () => {

it('should enforce an array of strings for the locationTracking property', async () => {
    const req = {
        body: {
            email: 'test50@test.com',
            username: "test",
            password: "test",
            password2: "test",
            isArtist: false,
            areaCode: "12345",
            locationTracking: [1,2,3,4,5],
            }
        }

        await validators.signUpSchema(req, res, next)

        expect(next).toHaveBeenCalledWith(new Error('locationTrackings must be a string'))

    })
        


  it("should set a status code of 400 and throw an error over an already existing email", async () => {
    const req = {
      body: {
        email: "test@test.com",
        username: "test",
        password: "test",
        password2: "test",
        isArtist: false,
        areaCode: "12345",
        locationTracking: ["Orange", "Los Angeles"],
      },
    };

    Users.findOne.mockImplementationOnce(() => ({
      email: req.body.email,
    }));

    await authController.SignUp(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      new Error("User already exists with that email")
    );
  });

  it("should set a status code of 400 and throw an error over an already existing username", async () => {
    const req = {
      body: {
        email: "test10@test.com",
        username: "macfittondev",
        password: "test",
        password2: "test",
        isArtist: false,
        areaCode: "12345",
        locationTracking: ["Orange", "Los Angeles"],
      },
    };

    Users.findOne.mockImplementationOnce(() => ({
      username: req.body.username,
    }));

    await authController.SignUp(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(
      new Error("User already exists with that email")
    );
  });

  it.todo('should hash the password', async () => {
    const password = 'test'

    const hash = await helpers.hashPassword(password, res).mockImplementationOnce(() => ({
        password: req.body.password,
        }));

});

describe("Login", () => {

  it("should set a status code of 400 and throw an error over an incorrect password", async () => {
    const req = {
      body: {
        emailOrUsername: "macfittondev",
        password: "test",
      },
    };

    Users.findOne.mockImplementationOnce(() => ({
      emailOrUsername: req.body.emailOrUsername,
      password: "test2",
    }));

    await authController.Login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error("Invalid credentials"));
  });


});

