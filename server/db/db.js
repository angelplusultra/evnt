import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI, { dbName: 'Evnt' });
    if (conn) {
      // eslint-disable-next-line no-console
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
