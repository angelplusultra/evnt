import nodemailer from 'nodemailer';
import axios from 'axios';
import asyncHanlder from 'express-async-handler';
import helpers from '../../helpers/helpers.js';
import Events from '../../models/Events.js';

const controller = {
  // * @desc Get all Events based on users location tracking & followed
  // * @route GET /api/events
  // * @access PRIVATE
  GetEvents: async (req, res) => {
    console.log(req.user);
    const events = await Events.find({}).lean();
    res.send('Get Events');
  },
  // * @desc Get Followed Activity
  // * @route GET /api/activity
  // * @access PRIVATE

  GetActivity: (req, res) => {
    res.send('Get Activity');
  },
  // * @desc Follow a User
  // * @route POST /api/follow
  // * @access PRIVATE
  FollowUser: (req, res) => {
    res.send('Follow User');
  },

  // * @desc Create a new Event
  // * @route POST /api/events
  // * @access PRIVATE
  CreateEvent: asyncHanlder(async (req, res) => {
    const {
      title, host, location, date, genre, lineup, attendance,
    } = req.body;
    console.log(res.statusCode);
    helpers.eventValidator(title, host, location, date, genre, lineup, attendance, res);

    // const locationData = await axios.get(`https://service.zipapi.us/zipcode/county/${location.zipcode}?X-API-KEY=${process.env.ZIP_API_KEY}`);

    // const { counties } = locationData.data.data;

    const event = new Events({
      title, host, location, date, genre, lineup, attendance,
    });

    // event.location.county = counties[0];

    res.json(event);
  }),
  SendEmail: async (req, res) => {

  },

};

export default controller;
