import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import validator from "validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";

const helpers = {
 hashPassword: asyncHandler(async (password, res) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  if (!hash) {
   res.status(500);
   throw new Error("Something went wrong");
  }
  return hash;
 }),
 // ! Refactor this to use yup for schema validation
 signUpDataValidation: (
  username,
  email,
  password,
  password2,
  areaCode,
  res
 ) => {
  if (!validator.isEmail(email)) {
   res.status(400);
   throw new Error("Please enter a valid email");
  }
  if (password !== password2) {
   res.status(400);
   throw new Error("Passwords do not match");
  }
  if (!validator.isPostalCode(areaCode, "US")) {
   res.status(400);
   throw new Error("Please enter a valid area code");
  }
  return true;
 },
 comparePassword: asyncHandler(async (password, hash, res) => {
  const isMatch = await bcrypt.compare(password, hash);

  if (!isMatch) {
   res.status(400);
   throw new Error("Invalid credentials");
  }
  return isMatch;
 }),

 genToken: (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
   expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
 },
 genEmail: async function genEmail({ username, email, verifyToken, res }) {
  const { NODE_ENV } = process.env;
  const transporter = nodemailer.createTransport({
   service: NODE_ENV === "prod" ? "gmail" : "mailtrap",
   auth: {
    user: NODE_ENV === "prod" ? "evntweb@gmail.com" : "917368b2a7fa16",
    pass: NODE_ENV === "prod" ? process.env.EMAIL_PASSWORD : "a843cfe71f62ee",
   },
  });
  const handlebarOptions = {
   viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
   },
   viewPath: path.resolve("./views/email"),
  };
  transporter.use("compile", hbs(handlebarOptions));

  const msg = {
   from: '"Evnt" <eventweb@gmail.com>',
   to: `${email}`,
   subject: "Please verify account",
   template: "email",
   context: {
    url: `http://localhost:5000/auth/verify/${verifyToken}`,
    user: username,
   },
  };
  const mail = await transporter.sendMail(msg);
  // ! Later on, make it so the user can resend the email if they didn't get it
  if (!mail) {
   res.status(400);
   throw new Error("Email could not be sent");
  }
  return mail;
 },
 // * Validate data from user input (for schema validation see server/middleware/validation/validators.js)
 validateEventData: async (host, { zipCode }, date, attendance, res) => {
  const { user, status } = attendance[0];

  const validStatus = ["going"];

  const formattedStatus = status.toLowerCase();

  if (!validStatus.includes(formattedStatus)) {
   res.status(400);
   throw new Error(
    'A new event must have at least one attendee with the status of "Going", please fill in all required fields'
   );
  }

  if (!validator.isDate(new Date(date))) {
   res.status(400);
   throw new Error("Please enter a valid date");
  }
  if (!mongoose.Types.ObjectId.isValid(host)) {
   res.status(400);
   throw new Error("Invalid host id");
  }

  if (!mongoose.Types.ObjectId.isValid(user)) {
   res.status(400);
   throw new Error("Invalid attendant id");
  }

  if (!validator.isPostalCode(zipCode, "US")) {
   res.status(400);
   throw new Error("Please enter a valid zipcode");
  }

  return true;
 },
};

export default helpers;
