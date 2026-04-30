import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('ERROR: MONGO_URI is not defined');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};


export default connectDB;
