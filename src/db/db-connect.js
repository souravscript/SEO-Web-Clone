import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    // If already connected, return the existing connection
    return;
  }
  //mongodb+srv://souravshivam1857:<db_password>@cluster0.jehif.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  //const { MONGODB_URI } = process.env;
  //const MONGODB_URI="mongodb+srv://souravshivam1857:0EsTxXMeftNw6gCw@cluster0.jehif.mongodb.net/"
  const MONGO_URI="mongodb+srv://souravshivam1857:0EsTxXMeftNw6gCw@cluster0.jehif.mongodb.net/SEO_Engine?retryWrites=true&w=majority&appName=Cluster0"
  if (!MONGO_URI) {
    throw new Error('Please define the MONGODB_URI in the .env.local file');
  }

  await mongoose.connect(MONGO_URI);
};

export default connectToDatabase;