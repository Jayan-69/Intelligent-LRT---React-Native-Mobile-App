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
    trainName: 'Semi Express 1',
    trainNumber: 'SE1',
    status: 'Delayed',
    capacity: 120
  },
  {
    trainName: 'Intercity Express 2',
    trainNumber: 'I2',
    status: 'On Time',
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
    createdBy: null
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
    departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'On Time',
    createdBy: null
  },
  {
    trainId: 'E2',
    trainName: 'Express Train 2',
    trainType: 'E',
    departureTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    status: 'Delayed',
    createdBy: null
  }
];

const sampleQuickMessages = [
  {
    content: 'Welcome to Intelligent LRT! Enjoy your journey.',
    createdBy: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    content: 'Please maintain social distancing and wear masks.',
    createdBy: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
];

// Enhanced train schedule with status and Semi Express trains
const enhancedTrainSchedule = trainSchedule.map(schedule => ({
  ...schedule,
  status: 'On Time', // Default status for all schedules
  stops: schedule.stops || [schedule.from, schedule.to]
}));

// Add some Semi Express trains
const semiExpressSchedules = [
  {
    trainCode: 'SE1',
    trainType: 'SE',
    from: 'Ragama',
    to: 'Kirulapona',
    departureTime: '08:15 AM',
    stops: ['Ragama', 'Kadawatha', 'Maradana', 'Pettah', 'Kirulapona'],
    period: 'Morning Office Hours',
    status: 'On Time'
  },
  {
    trainCode: 'SE2',
    trainType: 'SE',
    from: 'Kirulapona',
    to: 'Ragama',
    departureTime: '09:30 AM',
    stops: ['Kirulapona', 'Pettah', 'Maradana', 'Kadawatha', 'Ragama'],
    period: 'Morning Office Hours',
    status: 'On Time'
  },
  {
    trainCode: 'SE3',
    trainType: 'SE',
    from: 'Ragama',
    to: 'Pettah',
    departureTime: '05:30 PM',
    stops: ['Ragama', 'Kadawatha', 'Maradana', 'Pettah'],
    period: 'Evening Office Hours',
    status: 'Delayed'
  }
];

// Database setup function with improved connection handling
const setupDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    // Connect to MongoDB with updated options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    console.log('Connected to MongoDB successfully!');
    console.log('Database name:', mongoose.connection.name);
    
    // Wait for connection to be ready
    await mongoose.connection.asPromise();
    
    // Clear existing data with individual operations
    console.log('Clearing existing data...');
    
    try {
      await Station.deleteMany({}).maxTimeMS(10000);
      console.log('Stations cleared');
    } catch (error) {
      console.log('Warning: Could not clear stations:', error.message);
    }
    
    try {
      await Route.deleteMany({}).maxTimeMS(10000);
      console.log('Routes cleared');
    } catch (error) {
      console.log('Warning: Could not clear routes:', error.message);
    }
    
    try {
      await Train.deleteMany({}).maxTimeMS(10000);
      console.log('Trains cleared');
    } catch (error) {
      console.log('Warning: Could not clear trains:', error.message);
    }
    
    try {
      await User.deleteMany({}).maxTimeMS(10000);
      console.log('Users cleared');
    } catch (error) {
      console.log('Warning: Could not clear users:', error.message);
    }
    
    try {
      await Notice.deleteMany({}).maxTimeMS(10000);
      console.log('Notices cleared');
    } catch (error) {
      console.log('Warning: Could not clear notices:', error.message);
    }
    
    try {
      await TrainNotice.deleteMany({}).maxTimeMS(10000);
      console.log('Train notices cleared');
    } catch (error) {
      console.log('Warning: Could not clear train notices:', error.message);
    }
    
    try {
      await QuickMessage.deleteMany({}).maxTimeMS(10000);
      console.log('Quick messages cleared');
    } catch (error) {
      console.log('Warning: Could not clear quick messages:', error.message);
    }
    
    console.log('Existing data cleared.');
    
    // Create stations
    console.log('Creating stations...');
    const stationData = stations.map(name => ({ name }));
    const createdStations = await Station.insertMany(stationData);
    console.log(`Created ${createdStations.length} stations.`);
    
    // Create routes with enhanced data
    console.log('Creating routes...');
    const allRoutes = [...enhancedTrainSchedule, ...semiExpressSchedules];
    const createdRoutes = await Route.insertMany(allRoutes);
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

    console.log('\nTrain Types Available:');
    console.log('- Express (E)');
    console.log('- Slow (S)');
    console.log('- Intercity (I)');
    console.log('- Semi Express (SE)');
    
    console.log('\nDatabase is ready for the LRT application!');
    
  } catch (error) {
    console.error('Error setting up database:', error.message);
    
    if (error.message.includes('timeout')) {
      console.log('\n🔧 Troubleshooting timeout issues:');
      console.log('1. Check your internet connection');
      console.log('2. Verify your IP is whitelisted in MongoDB Atlas');
      console.log('3. Try running: node test-connection.js first');
      console.log('4. Check if the connection string is correct');
    }
    
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }
};

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 