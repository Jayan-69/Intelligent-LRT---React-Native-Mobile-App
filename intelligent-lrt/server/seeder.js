const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// Load models
const Station = require('./models/Station');
const Route = require('./models/Route');

// Load the hardcoded data
const { stations, trainSchedule } = require('../src/data/trainData');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await Station.deleteMany();
    await Route.deleteMany();

    // Format station data for insertion
    const stationData = stations.map(name => ({ name }));
    await Station.insertMany(stationData);

    // The trainSchedule is already in a good format for the Route model
    await Route.insertMany(trainSchedule);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Station.deleteMany();
    await Route.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
