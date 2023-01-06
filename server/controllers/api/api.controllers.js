import axios from 'axios';
import asyncHanlder from 'express-async-handler';
import mongoose from 'mongoose';
import helpers from '../../helpers/helpers.js';
import Events from '../../models/Events.js';
import Users from '../../models/Users.js';

const controller = {
  // * @desc Get all Events based on users location tracking & followed
  // * @route GET /api/events
  // * @access PRIVATE
  GetAllEvents: asyncHanlder(async (req, res) => {
    const { locationTracking, following } = req.user;
    const events = await Events.find().where('location.county').in(locationTracking).lean();
    const followedEvents = await Events.find().where('host').in(following).lean();
    const allEvents = [...events, ...followedEvents];

    allEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allEvents);
  }),
  GetFollowingEvents: asyncHanlder(async (req, res) => {
    const { following } = req.user;
    const followedEvents = await Events.find().where('host').in(following).sort({ createdAt: 'desc' })
      .lean();

    res.json(followedEvents);
  }),
  // * @desc Get Single Event
  // * @route GET /api/events/:id
  // * @access PRIVATE
  GetEvent: asyncHanlder(async (req, res) => {
    res.send('Get Single Event');
  }),

  // * @desc Get the activity of users the user is following
  // * @route GET /api/activity
  // * @access PRIVATE
  GetActivity: asyncHanlder(async (req, res) => {
    //! Experimental approach here, might need to be refactored
    const { following } = req.user;
    const activity = await Users.find().where('_id').in(following).select('activity').lean();
    console.log(activity)
    const allActivity = activity.map((a) => a.activity);
    console.log(allActivity)
    const flattenedActivity = allActivity.flat();
    flattenedActivity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(flattenedActivity);
  }),

  // * @desc Create a new Event
  // * @route POST /api/events
  // * @access PRIVATE
  CreateEvent: asyncHanlder(async (req, res) => {
    const {
      title, host, location, date, genre, lineup, attendance,
    } = req.body;

    helpers.eventValidator(title, host, location, date, genre, lineup, attendance, res);

    const locationData = await axios.get(`https://service.zipapi.us/zipcode/county/${location.zipCode}?X-API-KEY=${process.env.ZIP_API_KEY}`);

    const { county: counties } = locationData.data.data;

    const event = new Events({
      title, host, location, date, genre, lineup, attendance,
    });
    const [county] = counties;
    event.location.county = county;
    // event.location.county = "New York County"
    await Users.findByIdAndUpdate(host, { $push: { activity: { activityDetails: `${req.user.username} created a new event called ${title}`, ref1: host, ref2: event._id } } }, { new: true });
    
    await event.save();

    res.json(event);
  }),
  // * @desc Follow/Unfollow a User
  // * @route PUT /api/users/:id
  // * @access PRIVATE

  FollowUser: asyncHanlder(async (req, res) => {
    const { _id } = req.user;
    const { id: userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error('Invalid user id');
    }

    if(userId === _id.toHexString()) {
      res.status(400);
      throw new Error('You cannot follow yourself');
    }


    const userExist = await Users.findById(userId).lean();

    if (!userExist) {
      res.status(400);
      throw new Error('User does not exist');
    }
    const user = await Users.findById(_id);

    if (!user) {
      res.status(400);
      throw new Error('User does not exist');
    }
    if (user.following.includes(userId)) {
      const filtered = user.following.filter((id) => id.toHexString() !== userId);
      user.following = filtered;
      await user.save();
      return res.status(200).send({ message: `${userExist.username} unfollowed` });
    }
    user.following.push(userId);
    // ! This is experimental, attempting to populate an array of strings containing the users activity with references to other users or events. We send the user id and then the client can make a request to the server to get the actual display name and the id can be used on the frontend to link to the user profile or event page via a route param
    user.activity.push({
      activityDetails: `${user._id} followed ${userExist._id}`,
    });
    await user.save();
    return res.status(200).send({ message: `${userExist.username} followed` });

    // const user = await Users
    //   .findByIdAndUpdate(_id, { $push: { followed: userId } }, { new: true }).lean();
  }),
  GetMe: asyncHanlder(async (req, res) => {
    const { _id } = req.user;
    const user = await Users.findById(_id).lean();

    //sort following by most recent createdAt

    user.activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(user);
  }),

};

export default controller;
