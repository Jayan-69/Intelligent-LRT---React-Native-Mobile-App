const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../server/.env' });

// Import all models
const Station = require('../server/models/Station');
const Route = require('../server/models/Route');
const Train = require('../server/models/Train');
const User = require('../server/models/User');
const Notice = require('../server/models/Notice');
const TrainNotice = require('../server/models/TrainNotice');
const QuickMessage = require('../server/models/QuickMessage');

// Create backup directory
const backupDir = path.join(__dirname, 'backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Function to export collection to JSON
const exportCollection = async (model, filename) => {
  try {
    console.log(`Exporting ${filename}...`);
    const data = await model.find({});
    
    // Convert mongoose documents to plain objects
    const plainData = data.map(doc => {
      const obj = doc.toObject();
      // Convert ObjectIds to strings for JSON serialization
      if (obj._id) {
        obj._id = obj._id.toString();
      }
      // Handle nested ObjectIds
      if (obj.createdBy && typeof obj.createdBy === 'object') {
        obj.createdBy = obj.createdBy.toString();
      }
      return obj;
    });
    
    const filePath = path.join(backupDir, `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(plainData, null, 2));
    console.log(`✅ Exported ${plainData.length} records to ${filePath}`);
    return plainData.length;
  } catch (error) {
    console.error(`❌ Error exporting ${filename}:`, error.message);
    return 0;
  }
};

// Function to create a complete backup
const createBackup = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSummary = {
      timestamp: new Date().toISOString(),
      collections: {},
      totalRecords: 0
    };

    // Export all collections
    const collections = [
      { model: Station, filename: 'stations' },
      { model: Route, filename: 'routes' },
      { model: Train, filename: 'trains' },
      { model: User, filename: 'users' },
      { model: Notice, filename: 'notices' },
      { model: TrainNotice, filename: 'train_notices' },
      { model: QuickMessage, filename: 'quick_messages' }
    ];

    for (const collection of collections) {
      const count = await exportCollection(collection.model, collection.filename);
      backupSummary.collections[collection.filename] = count;
      backupSummary.totalRecords += count;
    }

    // Create backup summary
    const summaryPath = path.join(backupDir, 'backup-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(backupSummary, null, 2));
    
    console.log('\n📊 Backup Summary:');
    console.log('==================');
    Object.entries(backupSummary.collections).forEach(([collection, count]) => {
      console.log(`${collection}: ${count} records`);
    });
    console.log(`Total records: ${backupSummary.totalRecords}`);
    console.log(`Backup location: ${backupDir}`);
    console.log(`Summary file: ${summaryPath}`);

    // Create a single combined backup file
    const combinedBackup = {};
    for (const collection of collections) {
      const filePath = path.join(backupDir, `${collection.filename}.json`);
      if (fs.existsSync(filePath)) {
        combinedBackup[collection.filename] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    }
    
    const combinedPath = path.join(backupDir, 'complete-backup.json');
    fs.writeFileSync(combinedPath, JSON.stringify(combinedBackup, null, 2));
    console.log(`\n📦 Complete backup saved to: ${combinedPath}`);

  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Function to restore from backup
const restoreFromBackup = async (backupFile) => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const backupPath = path.join(backupDir, backupFile);
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    console.log('🔄 Restoring data...');
    
    for (const [collectionName, data] of Object.entries(backupData)) {
      if (data.length > 0) {
        const model = getModelByName(collectionName);
        if (model) {
          // Clear existing data
          await model.deleteMany({});
          
          // Insert backup data
          const result = await model.insertMany(data);
          console.log(`✅ Restored ${result.length} records to ${collectionName}`);
        }
      }
    }

    console.log('✅ Restore completed successfully');

  } catch (error) {
    console.error('❌ Restore failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Helper function to get model by name
const getModelByName = (name) => {
  const models = {
    stations: Station,
    routes: Route,
    trains: Train,
    users: User,
    notices: Notice,
    train_notices: TrainNotice,
    quick_messages: QuickMessage
  };
  return models[name];
};

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'restore' && process.argv[3]) {
    restoreFromBackup(process.argv[3]);
  } else {
    createBackup();
  }
}

module.exports = { createBackup, restoreFromBackup }; 