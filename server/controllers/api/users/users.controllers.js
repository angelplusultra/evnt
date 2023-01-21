import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Events from '../../../models/Events.js';
import Users from '../../../models/Users.js';

const controller = {
  // * @desc Get the activity of users the user is following
  // * @route GET /api/activity
  // * @access PRIVATE
  GetActivity: asyncHandler(async (req, res) => {
    //! Experimental approach here, might need to be refactored

    const { following } = req.user;
    const activity = await Users.find()
      .where('_id')
      .in(following)
      .select('activity')
      .lean();

    const allActivity = activity.map((a) => a.activity);
    const flattenedActivity = allActivity.flat();
    flattenedActivity.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    // * Replace all the ids in the activityDetails with the users and events names

    // eslint-disable-next-line consistent-return
    const formattedArray = flattenedActivity.map(async (a) => {
      if (a.activityDetails.includes('followed')) {
        const userId = a.activityDetails.split(' ')[0];
        const followedId = a.activityDetails.split(' ')[2];

        const user = await Users.findById(userId).select('username').lean();
        const followed = await Users.findById(followedId)
          .select('username')
          .lean();

        if (!user) {
          return {
            activityDetails: `Deleted User followed ${followed.username}`,
            userId,
            followedId,
          };
        }
        if (!followed) {
          return {
            activityDetails: `${user.username} followed Deleted User`,
            userId,
            followedId,
          };
        }
        return {
          activityDetails: `${user.username} followed ${followed.username}`,
          activityType: 'Follow',
          user: {
            id: userId,
            username: user.username,
          },
          followed: {
            id: followedId,
            username: followed.username,
          },
        };
      }
      if (a.activityDetails.includes('created')) {
        const userId = a.activityDetails.split(' ')[0];
        const eventId = a.activityDetails.split(' ')[a.activityDetails.split(' ').length - 1];
        const user = await Users.findById(userId).select('username').lean();
        const event = await Events.findById(eventId).select('title').lean();
        return {
          activityDetails: `${user.username} created a new event called ${event.title}`,
          activityType: 'Event Creation',
          user: {
            id: userId,
            username: user.username,
          },
          event: {
            id: eventId,
            title: event.title,
          },
        };
      }
      if (a.activityDetails.includes('joined')) {
        const userId = a.activityDetails.split(' ')[0];
        const user = await Users.findById(userId).select('username').lean();
        return {
          activityDetails: `${user.username} joined Evnt!`,
          activityType: 'Sign Up',
          id: a._id,
        };
      }
    });

    const formattedActivity = await Promise.all(formattedArray);
    console.log(formattedActivity);
    res.status(200).json(formattedActivity);
  }),

  GetFollowers: asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const followers = await Users.find({ following: _id }).lean().select('username _id');
    res.status(200).json(followers);
  }),

  // * @desc Follow/Unfollow a User
  // * @route PUT /api/users/:id
  // * @access PRIVATE

  FollowUser: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { id: userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error('Invalid user id');
    }

    if (userId === _id.toHexString()) {
      res.status(400);
      throw new Error('You cannot follow yourself');
    }

    const userExist = await Users.findById(userId);

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
      const filtered = user.following.filter(
        (id) => id.toHexString() !== userId,
      );
      const filtered2 = userExist.followers.filter(
        (id) => id.toHexString() !== _id.toHexString(),
      );
      userExist.followers = filtered2;
      user.following = filtered;

      await userExist.save();
      await user.save();
      return res
        .status(200)
        .send({ message: `${userExist.username} unfollowed` });
    }
    user.following.push(userId);
    userExist.followers.push(_id);

    user.activity.push({
      activityDetails: `${user._id} followed ${userExist._id}`,
    });
    await user.save();
    await userExist.save();
    return res.status(200).send({ message: `${userExist.username} followed` });

    // const user = await Users
    //   .findByIdAndUpdate(_id, { $push: { followed: userId } }, { new: true }).lean();
  }),
  GetMe: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await Users.findById(_id).select('-password').lean();

    // sort following by most recent createdAt

    user.activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(user);
  }),

  // * @desc Get all users
  // * @route GET /api/users
  // * @access PRIVATE
  GetAllUsers: asyncHandler(async (req, res) => {
    const users = await Users.find().lean();
    res.json(users);
  }),

  GetSingleUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid user ID');
    }
    const user = await Users.findById(id).lean();
    if (!user) {
      res.status(404);
      throw new Error('User does not exist');
    }
    delete user.password;
    res.status(200).json(user);
  }),
};

export default controller;
