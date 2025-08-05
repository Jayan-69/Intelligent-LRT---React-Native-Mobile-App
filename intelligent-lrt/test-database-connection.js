const mongoose = require('mongoose');

// Test database connection with local IP
const testDatabaseConnection = async () => {
  const MONGO_URI = 'mongodb://192.168.86.1:27017/lrt_tracking';
  
  console.log('🔍 Testing database connection to:', MONGO_URI);
  
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    
    // Test if we can access collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📚 Available collections: ${collections.length}`);
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. MongoDB is running on 192.168.86.1:27017');
    console.log('   2. The IP address is correct');
    console.log('   3. MongoDB is accessible from this machine');
    console.log('   4. No firewall is blocking the connection');
  }
};

// Run the test
testDatabaseConnection(); 