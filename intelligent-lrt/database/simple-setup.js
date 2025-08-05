const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../server/.env' });

// Import models
const Station = require('../server/models/Station');
const Route = require('../server/models/Route');
const Train = require('../server/models/Train');
const User = require('../server/models/User');
const Notice = require('../server/models/Notice');
const TrainNotice = require('../server/models/TrainNotice');
const QuickMessage = require('../server/models/QuickMessage');

// Import data
const { stations, trainSchedule } = require('../src/data/trainData');

// Sample data for seeding
const sampleTrains = [
  {
    trainName: 'Intercity Express 1',
    trainNumber: 'I1',
    status: 'On Time',
    capacity: 200
  },
  {
    trainName: 'Express Train 1',
    trainNumber: 'E1',
    status: 'On Time',
    capacity: 150
  },
  {
    trainName: 'Slow Train 1',
    trainNumber: 'S1',
    status: 'On Time',
    capacity: 100
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@lrt.com',
    role: 'admin',
    googleId: 'admin123'
  },
  {
    name: 'Regular User',
    email: 'user@lrt.com',
    role: 'user',
    googleId: 'user123'
  }
];

const sampleNotices = [
  {
    title: 'System Maintenance Notice',
    content: 'Scheduled maintenance will be conducted on Sunday from 2 AM to 6 AM. Some delays may occur.',
    type: 'Special',
    createdBy: null
  }
];

const setupDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect with longer timeout
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    
    // Clear existing data with timeout handling
    console.log('🧹 Clearing existing data...');
    
    try {
      await Promise.all([
        Station.deleteMany({}).maxTimeMS(15000),
        Route.deleteMany({}).maxTimeMS(15000),
        Train.deleteMany({}).maxTimeMS(15000),
        User.deleteMany({}).maxTimeMS(15000),
        Notice.deleteMany({}).maxTimeMS(15000),
        TrainNotice.deleteMany({}).maxTimeMS(15000),
        QuickMessage.deleteMany({}).maxTimeMS(15000)
      ]);
      console.log('✅ Existing data cleared.');
    } catch (clearError) {
      console.log('⚠️ Some collections could not be cleared, continuing...');
    }
    
    // Create stations
    console.log('🚉 Creating stations...');
    const stationObjects = stations.map(stationName => ({ name: stationName }));
    const createdStations = await Station.insertMany(stationObjects, { maxTimeMS: 30000 });
    console.log(`✅ Created ${createdStations.length} stations`);
    
    // Create routes
    console.log('🛤️ Creating routes...');
    const createdRoutes = await Route.insertMany(trainSchedule, { maxTimeMS: 30000 });
    console.log(`✅ Created ${createdRoutes.length} routes`);
    
    // Create trains
    console.log('🚂 Creating trains...');
    const createdTrains = await Train.insertMany(sampleTrains, { maxTimeMS: 30000 });
    console.log(`✅ Created ${createdTrains.length} trains`);
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(sampleUsers, { maxTimeMS: 30000 });
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Create notices
    console.log('📢 Creating notices...');
    const createdNotices = await Notice.insertMany(sampleNotices, { maxTimeMS: 30000 });
    console.log(`✅ Created ${createdNotices.length} notices`);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Stations: ${createdStations.length}`);
    console.log(`   - Routes: ${createdRoutes.length}`);
    console.log(`   - Trains: ${createdTrains.length}`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Notices: ${createdNotices.length}`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify the MongoDB Atlas connection string');
    console.log('   3. Ensure your IP is whitelisted in MongoDB Atlas');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
};

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 