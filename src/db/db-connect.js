import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    // If already connected, return the existing connection
    return;
  }
  const MONGO_URI=process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('Please define the MONGODB_URI in the .env.local file');
  }

  const connect=await mongoose.connect(MONGO_URI);
  console.log("database connected successfully with ",connect )
};

export default connectToDatabase;
