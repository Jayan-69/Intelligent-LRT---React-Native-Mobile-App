# Intelligent LRT Database Setup

This document provides step-by-step instructions for setting up the MongoDB database and running the Intelligent LRT (Light Rail Transit) application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Expo CLI (for mobile development)

## Database Configuration

The application uses MongoDB Atlas with the following connection details:
- **Connection String**: `mongodb+srv://lrt-admin:Sj0k80NUWfvhFFPl@cluster0.ubpov8g.mongodb.net/`
- **Database**: The database will be created automatically
- **Collections**: stations, routes, trains, users, notices, trainnotices, quickmessages

## Step-by-Step Setup Instructions

### 1. Install Dependencies

Navigate to the project root and install dependencies:

```bash
cd intelligent-lrt
npm install
```

### 2. Install Server Dependencies

Navigate to the server directory and install backend dependencies:

```bash
cd server
npm install
```

### 3. Set Up Environment Variables

The server already has the correct MongoDB URI in the `.env` file:
```
MONGODB_URI=mongodb+srv://lrt-admin:Sj0k80NUWfvhFFPl@cluster0.ubpov8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5001
```

### 4. Set Up the Database

Run the database setup script to create all collections and seed them with initial data:

```bash
cd database
node setup-database.js
```

This will create:
- **Stations**: 20 stations along the Sri Lankan railway route
- **Routes**: Complete train schedule with Intercity, Express, and Slow trains
- **Trains**: 5 sample trains with different statuses
- **Users**: 3 sample users (admin, superAdmin, regular user)
- **Notices**: 2 sample system notices
- **Train Notices**: 2 sample train-specific notices
- **Quick Messages**: 2 sample quick messages

### 5. Start the Backend Server

Navigate to the server directory and start the backend:

```bash
cd server
node server.js
```

The server will start on port 5001. You should see output like:
```
=== SERVER STARTED SUCCESSFULLY ===
Server is running on port 5001
Listening on all network interfaces (0.0.0.0)

AVAILABLE IP ADDRESSES:
- Interface Ethernet: http://192.168.1.100:5001/test
- Interface Wi-Fi: http://192.168.1.101:5001/test

To test locally, visit: http://localhost:5001/test
For your mobile device, use one of the IP addresses listed above.
=== SERVER CONFIGURATION COMPLETE ===
```

### 6. Test the Server

Visit `http://localhost:5001/test` in your browser to verify the server is running and connected to MongoDB.

### 7. Start the Mobile Application

In a new terminal, navigate to the project root and start the Expo development server:

```bash
cd intelligent-lrt
npx expo start
```

This will start the Expo development server and show a QR code for connecting to the mobile app.

### 8. Run on Mobile Device

- **Android**: Install Expo Go from Google Play Store and scan the QR code
- **iOS**: Install Expo Go from App Store and scan the QR code
- **Emulator**: Press 'a' for Android emulator or 'i' for iOS simulator

## Database Collections Overview

### 1. Stations Collection
- Contains all railway stations along the route
- Fields: `name` (unique)

### 2. Routes Collection
- Contains train schedules and routes
- Fields: `trainCode`, `trainType`, `from`, `to`, `departureTime`, `stops`, `period`

### 3. Trains Collection
- Contains individual train information
- Fields: `trainName`, `trainNumber`, `assignedDriver`, `status`, `capacity`

### 4. Users Collection
- Contains user accounts and roles
- Fields: `name`, `email`, `role`, `googleId`

### 5. Notices Collection
- Contains system-wide notices
- Fields: `title`, `content`, `type`, `relatedTrain`, `createdBy`

### 6. TrainNotices Collection
- Contains train-specific notices
- Fields: `trainId`, `trainName`, `trainType`, `departureTime`, `status`, `createdBy`

### 7. QuickMessages Collection
- Contains temporary messages with auto-expiry
- Fields: `content`, `createdBy`, `expiresAt`

## Sample Users

The database setup creates three sample users:

1. **Admin User**
   - Email: admin@lrt.com
   - Role: admin
   - Can manage trains and notices

2. **Super Admin**
   - Email: superadmin@lrt.com
   - Role: superAdmin
   - Can access system-wide analytics and predictions

3. **Regular User**
   - Email: user@lrt.com
   - Role: user
   - Can book tickets and track trains

## API Endpoints

The server provides the following API endpoints:

- `GET /api/trains` - Get all trains
- `POST /api/trains` - Create a new train
- `PUT /api/trains/:id` - Update train status
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create a new notice
- `GET /api/notices/train` - Get train-specific notices
- `POST /api/notices/train` - Create train notice

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify the connection string in `server/.env`
   - Check if MongoDB Atlas is accessible
   - Ensure the IP address is whitelisted in MongoDB Atlas

2. **Port Already in Use**
   - Change the PORT in `server/.env` to a different port
   - Kill any existing processes on port 5001

3. **Expo Connection Issues**
   - Ensure both devices are on the same network
   - Use the IP address shown in the server output
   - Check firewall settings

4. **Database Setup Errors**
   - Ensure all dependencies are installed
   - Check MongoDB connection string
   - Verify the data files exist

### Reset Database

To reset the database with fresh data:

```bash
cd database
node setup-database.js
```

## Development Notes

- The application uses React Native with Expo for cross-platform mobile development
- Redux Toolkit is used for state management
- The backend uses Express.js with Mongoose for MongoDB operations
- Real-time features are implemented using polling (can be upgraded to WebSockets)
- Google OAuth is integrated for authentication

## Security Notes

- The MongoDB connection string contains credentials - in production, use environment variables
- The application includes CORS configuration for development
- Authentication is handled through Google OAuth and local role-based access

## Next Steps

1. Test all user roles and functionalities
2. Customize the train schedules and stations as needed
3. Implement additional features like real-time tracking
4. Deploy to production with proper security measures 