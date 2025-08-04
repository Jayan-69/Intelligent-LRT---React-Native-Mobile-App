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
  },
  {
    trainName: 'Intercity Express 2',
    trainNumber: 'I2',
    status: 'Delayed',
    capacity: 200
  },
  {
    trainName: 'Express Train 2',
    trainNumber: 'E2',
    status: 'On Time',
    capacity: 150
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
    name: 'Super Admin',
    email: 'superadmin@lrt.com',
    role: 'superAdmin',
    googleId: 'superadmin123'
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
    createdBy: null // Will be set after user creation
  },
  {
    title: 'Weather Alert',
    content: 'Heavy rain expected. Trains may experience delays. Please plan your journey accordingly.',
    type: 'Delay',
    createdBy: null
  }
];

const sampleTrainNotices = [
  {
    trainId: 'I1',
    trainName: 'Intercity Express 1',
    trainType: 'I',
    departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: 'On Time',
    createdBy: null
  },
  {
    trainId: 'E2',
    trainName: 'Express Train 2',
    trainType: 'E',
    departureTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    status: 'Delayed',
    createdBy: null
  }
];

const sampleQuickMessages = [
  {
    content: 'Welcome to Intelligent LRT! Enjoy your journey.',
    createdBy: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    content: 'Please maintain social distancing and wear masks.',
    createdBy: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
];

// Database setup function
const setupDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB successfully!');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Station.deleteMany({});
    await Route.deleteMany({});
    await Train.deleteMany({});
    await User.deleteMany({});
    await Notice.deleteMany({});
    await TrainNotice.deleteMany({});
    await QuickMessage.deleteMany({});
    
    console.log('Existing data cleared.');
    
    // Create stations
    console.log('Creating stations...');
    const stationData = stations.map(name => ({ name }));
    const createdStations = await Station.insertMany(stationData);
    console.log(`Created ${createdStations.length} stations.`);
    
    // Create routes
    console.log('Creating routes...');
    const createdRoutes = await Route.insertMany(trainSchedule);
    console.log(`Created ${createdRoutes.length} routes.`);
    
    // Create trains
    console.log('Creating trains...');
    const createdTrains = await Train.insertMany(sampleTrains);
    console.log(`Created ${createdTrains.length} trains.`);
    
    // Create users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users.`);
    
    // Get admin user for notices
    const adminUser = createdUsers.find(user => user.role === 'admin');
    
    // Create notices with admin user reference
    console.log('Creating notices...');
    const noticesWithUser = sampleNotices.map(notice => ({
      ...notice,
      createdBy: adminUser._id
    }));
    const createdNotices = await Notice.insertMany(noticesWithUser);
    console.log(`Created ${createdNotices.length} notices.`);
    
    // Create train notices with admin user reference
    console.log('Creating train notices...');
    const trainNoticesWithUser = sampleTrainNotices.map(notice => ({
      ...notice,
      createdBy: adminUser._id
    }));
    const createdTrainNotices = await TrainNotice.insertMany(trainNoticesWithUser);
    console.log(`Created ${createdTrainNotices.length} train notices.`);
    
    // Create quick messages with admin user reference
    console.log('Creating quick messages...');
    const quickMessagesWithUser = sampleQuickMessages.map(message => ({
      ...message,
      createdBy: adminUser._id
    }));
    const createdQuickMessages = await QuickMessage.insertMany(quickMessagesWithUser);
    console.log(`Created ${createdQuickMessages.length} quick messages.`);
    
    console.log('\n=== DATABASE SETUP COMPLETE ===');
    console.log('Collections created:');
    console.log(`- Stations: ${createdStations.length} records`);
    console.log(`- Routes: ${createdRoutes.length} records`);
    console.log(`- Trains: ${createdTrains.length} records`);
    console.log(`- Users: ${createdUsers.length} records`);
    console.log(`- Notices: ${createdNotices.length} records`);
    console.log(`- Train Notices: ${createdTrainNotices.length} records`);
    console.log(`- Quick Messages: ${createdQuickMessages.length} records`);
    
    console.log('\nSample Users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\nDatabase is ready for the LRT application!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 