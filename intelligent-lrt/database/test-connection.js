const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../server/.env' });

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState);
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));
    
    console.log('\n✅ Connection test completed successfully!');
    console.log('You can now run the database setup script.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if MONGODB_URI is set in server/.env');
    console.log('2. Verify the connection string is correct');
    console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('4. Check your internet connection');
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// Run the test
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection }; 