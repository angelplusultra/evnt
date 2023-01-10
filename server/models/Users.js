import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isArtist: {
      type: Boolean,
      default: false,
    },
    //! Location tracking to be used later, for now, users are
    //! created and get events based on a single area code they provide
    locationTracking: {
      type: [String],
      required: true,
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },
    areaCode: {
      type: String,
      required: true,
    },
    createdEvents: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'Event',
    },
    attendingEvents: {
      type: [{
        event: mongoose.Schema.Types.ObjectId,
        status: String,
      }],
      default: [],
      ref: 'Event',
    },
    activity: {
      type: [
        new mongoose.Schema(
          {
            activityDetails: String,
            user: mongoose.Schema.Types.ObjectId,
            reference: mongoose.Schema.Types.ObjectId,
          },
          { timestamps: true },
        ),
      ],
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
