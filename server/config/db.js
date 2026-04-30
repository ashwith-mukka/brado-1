import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined');
    return;
  }

  console.log('📡 Connecting to MongoDB...');
  
  cachedConnection = mongoose.connect(process.env.MONGO_URI, {
    bufferCommands: false,
  }).then((conn) => {
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  }).catch((err) => {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    cachedConnection = null; // Reset cache on failure so next request can retry
    throw err;
  });

  return cachedConnection;
};


export default connectDB;
