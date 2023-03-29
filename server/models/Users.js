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
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isArtist: {
      type: Boolean,
      default: false,
      immutable: true,
    },
   artistName: {
    type: String,
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
    followers: {
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
    performingEvents: {
      type: [{
        event: mongoose.Schema.Types.ObjectId,
        status: String,
      }],
      default: undefined,
      
      ref: 'Event',
    },
    images: {
      profileImages: {
        type: [{
          imagePath: String,
          cloudinaryId: String,
		  selectedProfile: Boolean,
        }],

      },
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
