import axios from 'axios';
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose';
import helpers from '../../../helpers/helpers.js';
import Events from '../../../models/Events.js';
import Users from '../../../models/Users.js';

const controller = {
  // * @desc Get all Events based on users location tracking & followed
  // * @route GET /api/events
  // * @access PRIVATE
  GetAllEvents: asyncHandler(async (req, res) => {
    const { locationTracking, following } = req.user;
    const events = await Events.find()
      .where('location.county')
      .in(locationTracking)
      .lean();
    const followedEvents = await Events.find()
      .where('host')
      .in(following)
      .lean();
    const allEvents = [...events, ...followedEvents];

    allEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allEvents);
  }),
  // * @desc Get Single Event
  // * @route GET /api/events/:id
  // * @access PRIVATE

  GetSingleEvent: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid event ID');
    }
    const event = await Events.findById(id);
    if (!event) {
      res.status(404);
      throw new Error('Event does not exist');
    }
    res.status(200).json(event);
  }),
  // * @desc Get all Events based on users they are following
  // * @route GET /api/events/following
  // * @access PRIVATE
  GetFollowingEvents: asyncHandler(async (req, res) => {
    const { following } = req.user;
    const followedEvents = await Events.find()
      .where('host')
      .in(following)
      .sort({ createdAt: 'desc' })
      .lean();

    res.json(followedEvents);
  }),

  CreateEvent: asyncHandler(async (req, res) => {
    const {
      title, host, location, date, genre, lineup, attendance,
    } = req.body;

    // @desc Data Validation
    helpers.validateEventData(host, location, date, attendance, res);

    if (host !== req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot create an event for another user');
    }
    const locationData = await axios.get(
      `https://service.zipapi.us/zipcode/county/${location.zipCode}?X-API-KEY=${process.env.ZIP_API_KEY}`,
    );

    const { county: counties } = locationData.data.data;

    const event = new Events({
      title,
      host,
      location,
      date,
      genre,
      lineup,
      attendance,
    });
    const [county] = counties;
    event.location.county = county;
    // event.location.county = "New York County"
    await Users.findByIdAndUpdate(
      host,
      {
        $push: {
          activity: {
            activityDetails: `${host} created a new event called ${event._id}`,
            user: [host],
            reference: event._id,
          },
          createdEvents: event._id,

          attendingEvents: {
            event: event._id,
            status: 'going',
          },
        },
      },
      { new: true },
    );

    await event.save();

    res.json(event);
  }),

  // * @desc Push a new attendance object to the event conatining the user id and their status (going or maybe)
  // * @route PUT /api/events/:id/attend
  // * @access PRIVATE
  // ! Unsure how to handle the attendance status at the moment,
  // ! might need to refactor once I get more of sense of how the frontend will work

  MarkAttendance: asyncHandler(async (req, res) => {
    // @Step: 1 - Validate data (event id, status)
    const { status } = req.body;
    const { _id } = req.user;
    const { id: eventId } = req.params;


    const event = await Events.findById(eventId);

    if (!event) {
      res.status(400);
      throw new Error('Event does not exist');
    }

    // @Step: 2 - Check if the user has already marked their attendance status
    const { attendance } = event;

    const attendanceStatusExists = attendance.find(
      (user) => user.user._id.toString() === _id.toString(),
    );

    // @Step: 3 - If the user has already marked their attendance status, update it
    if (attendanceStatusExists) {
      if (attendanceStatusExists.status === status) {
        res.status(401);
         throw new Error(`You have already marked your attendance status as ${status}`);
      }

      attendanceStatusExists.status = status;
      await event.save();
      await Users.findByIdAndUpdate(
        _id,
        {
          $push: {
            activity: {
              activityDetails: `${req.user._id} updated their attendance status to ${status} for ${event._id}`,
              ref1: _id,
              ref2: event._id,
            },

          },

        },
        { new: true },
      );

      // @ Step: 4 - Update the user's attendingEvents array

      const user = await Users.findById(_id);
      const attendingEvent = user.attendingEvents.find(
        (ev) => ev.event.toString() === eventId.toString(),
      );
      attendingEvent.status = status;
      await user.save();

      return res.status(200).send({
        message: `You have updated your attendance status for ${event.title} to ${status}`,
        attendance,
        event,
      });
    }

    // @Step: 5 - If the user has not already marked their attendance status, push a new object to the attendance array
    attendance.push({ user: _id, status });
    await event.save();
    await Users.findByIdAndUpdate(
      _id,
      {
        $push: {
          activity: {
            activityDetails: `${req.user._id} marked their attendance status as ${status} for ${event._id}`,
            ref1: _id,
            ref2: event._id,
          },
          attendingEvents: {
            event: event._id,
            status,
          },
        },
      },
      { new: true },
    );
    return res.status(200).send({
      message: `You have marked your attendance status for ${event.title} as ${status}`,
      attendance,
      event,
    });
  }),

  // * @desc Delete a user from the attendance array of an event
  // * @route DELETE /api/events/:id/attend
  // * @access PRIVATE
  DeleteAttendance: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { id: eventId } = req.params;

    // @ Step: 1 - Validate data (event id)\
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400);
      throw new Error('Invalid event id');
    }

    const event = await Events.findById(eventId);

    if (!event) {
      res.status(400);
      throw new Error('Event does not exist');
    }

    // @Step: 2 - Check if the user has already marked their attendance status
    const { attendance } = event;

    const attendanceStatusExists = attendance.find(
      (attendant) => attendant.user.toString() === _id.toString(),
    );

    if (!attendanceStatusExists) {
      res.status(400);
      throw new Error('You have no attendance status with this event');
      // @Step: 3 - If the user has already marked their attendance status, delete it
    } else {
      const filteredAttendance = attendance.filter(
        (attendant) => attendant.user.toString() !== _id.toString(),
      );

      event.attendance = filteredAttendance;
      const updatedEvent = await event.save();

      // const user = await Users.findById(_id);
      // user.attendingEvents.pull({ event: eventId });

      // * $pull is a mongoose method that removes an object from an array
      // * $push is a mongoose method that adds an object to an array

      await Users.findByIdAndUpdate(
        _id,
        {
          $pull: {
            attendingEvents: { event: eventId },
          },
        },
        { new: true },
      );

      res.status(200).send({
        message: 'You have deleted your attendance status',
        updatedEvent,
      });
    }
  }),
};

export default controller;
