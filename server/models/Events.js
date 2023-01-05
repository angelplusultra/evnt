import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  location: {
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  lineup: {
    type: [
      new mongoose.Schema({
        artist: {
          type: String || mongoose.Schema.Types.ObjectId,
          required: true,
        },
      }),
    ],
  },
  attendance: {
    default: [],
    type: [
      new mongoose.Schema({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        status: {
          type: String,
          required: true,
        },
      }),
    ],
  },
});

export default mongoose.model('Event', eventSchema);
