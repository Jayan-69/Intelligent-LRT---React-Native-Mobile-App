import mongoose from 'mongoose';

// MongoDB connection URI - using MongoDB Atlas cloud database
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://lrt-admin:Sj0k80NUWfvhFFPl@cluster0.ubpov8g.mongodb.net/lrt_tracking?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Check if we're in a React Native environment
    if (typeof window !== 'undefined' && window.navigator && window.navigator.product === 'ReactNative') {
      console.log('Running in React Native environment');
    }

    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit process in React Native, just log the error
    console.warn('Falling back to in-memory storage');
    return null;
  } 
};

export default connectDB;
