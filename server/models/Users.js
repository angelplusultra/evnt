import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  locationTracking: {
    type: [String],
    required: true,
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
  activity: {
    type: [new mongoose.Schema(
      {
        timeStamp: Date,
        activityDetails: String,
      },
      { timestamps: true },
    ),
    ],
  },

}, { timestamps: true });

export default mongoose.model('User', userSchema);
