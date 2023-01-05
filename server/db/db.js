import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI, { dbName: 'Evnt' });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
