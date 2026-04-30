import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('ERROR: MONGO_URI is not defined in environment variables');
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // DO NOT EXIT in production to allow the debug dashboard to show up
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};


export default connectDB;
