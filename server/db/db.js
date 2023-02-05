import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect("mongodb+srv://macfitton:tillery1@cluster0.1l0caqt.mongodb.net/?retryWrites=true&w=majority", { dbName: 'Evnt' });
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
