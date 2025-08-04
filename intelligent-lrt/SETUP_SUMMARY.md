# Intelligent LRT Solution - Complete Setup Guide

## Overview

The Intelligent LRT (Light Rail Transit) is a comprehensive mobile application built with React Native and Expo that modernizes the railway experience in Sri Lanka. The solution includes real-time train tracking, advanced scheduling, seamless ticketing with QR codes, and intelligent delay prediction.

## Solution Architecture

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack and Tab navigators)
- **UI Components**: React Native Paper, custom components
- **Maps**: react-native-maps
- **QR Codes**: react-native-qrcode-svg
- **Authentication**: Google OAuth, custom local authentication

### Backend (Server)
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **CORS**: Configured for mobile development
- **Port**: 5001 (configurable)

### Database (MongoDB Atlas)
- **Connection**: `mongodb+srv://lrt-admin:Sj0k80NUWfvhFFPl@cluster0.ubpov8g.mongodb.net/`
- **Collections**: 7 collections with comprehensive data structure

## Database Collections

### 1. Stations Collection
```javascript
{
  name: String (unique, required)
}
```
- Contains 20 stations along the Sri Lankan railway route
- From Ragama to Kirulapona

### 2. Routes Collection
```javascript
{
  trainCode: String (unique, required),
  trainType: String (enum: ['I', 'E', 'S']),
  from: String (required),
  to: String (required),
  departureTime: String (required),
  stops: [String] (required),
  period: String
}
```
- Complete train schedule with Intercity (I), Express (E), and Slow (S) trains
- Includes morning, evening, and non-office hour schedules
- Bidirectional routes (up and down trains)

### 3. Trains Collection
```javascript
{
  trainName: String (required),
  trainNumber: String (unique, required),
  assignedDriver: ObjectId (ref: 'User'),
  status: String (enum: ['On Time', 'Delayed', 'Cancelled']),
  capacity: Number (required)
}
```
- Individual train information
- Status tracking and capacity management

### 4. Users Collection
```javascript
{
  name: String (required),
  email: String (unique, required),
  role: String (enum: ['user', 'admin', 'superAdmin']),
  googleId: String
}
```
- User accounts with role-based access
- Supports Google OAuth integration

### 5. Notices Collection
```javascript
{
  title: String (required),
  content: String (required),
  type: String (enum: ['Special', 'Delay', 'Cancellation']),
  relatedTrain: ObjectId (ref: 'Train'),
  createdBy: ObjectId (ref: 'User', required)
}
```
- System-wide notices and announcements
- Can be linked to specific trains

### 6. TrainNotices Collection
```javascript
{
  trainId: String (required),
  trainName: String (required),
  trainType: String (required),
  departureTime: Date (required),
  status: String (enum: ['On Time', 'Delayed', 'Cancelled']),
  createdBy: ObjectId (ref: 'User')
}
```
- Train-specific notices and updates
- Real-time status updates

### 7. QuickMessages Collection
```javascript
{
  content: String (required),
  createdBy: ObjectId (ref: 'User'),
  expiresAt: Date (required, auto-expiry)
}
```
- Temporary messages with automatic expiration
- 7-day default expiry

## User Roles

### 1. Regular User (user)
- Book tickets with QR code generation
- Real-time train tracking
- View schedules and fares
- Access to user dashboard

### 2. Admin (admin)
- Train management and status updates
- Create and manage notices
- Real-time train tracking with admin controls
- Access to admin dashboard

### 3. Super Admin (superAdmin)
- System-wide analytics and predictions
- Delay prediction interface
- Complete system oversight
- Access to super admin dashboard

## Quick Setup Instructions

### Option 1: Automated Setup (Recommended)

**For Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```cmd
setup.bat
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../database && npm install
   ```

2. **Test Database Connection**
   ```bash
   cd database
   node test-connection.js
   ```

3. **Setup Database**
   ```bash
   node setup-database.js
   ```

4. **Start Backend Server**
   ```bash
   cd server
   node server.js
   ```

5. **Start Mobile App**
   ```bash
   npx expo start
   ```

## Sample Data Created

### Users
- **Admin**: admin@lrt.com (role: admin)
- **Super Admin**: superadmin@lrt.com (role: superAdmin)
- **Regular User**: user@lrt.com (role: user)

### Trains
- 5 sample trains with different statuses
- Intercity, Express, and Slow train types
- Various capacities and statuses

### Stations
- 20 stations along the Sri Lankan railway route
- Complete station network from Ragama to Kirulapona

### Routes
- Complete train schedule with all periods
- Morning Office Hours (6:00 AM - 9:00 AM)
- Evening Office Hours (4:00 PM - 7:00 PM)
- Non-Office Hours (10:00 AM - 4:00 PM & 7:00 PM onwards)

## API Endpoints

### Trains
- `GET /api/trains` - Get all trains
- `POST /api/trains` - Create a new train
- `PUT /api/trains/:id` - Update train status

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create a new notice
- `GET /api/notices/train` - Get train-specific notices
- `POST /api/notices/train` - Create train notice

## Key Features

### 1. Real-time Train Tracking
- Live location updates
- Station arrival/departure tracking
- Interactive maps with train positions

### 2. Intelligent Scheduling
- Multiple train types (Intercity, Express, Slow)
- Time-based scheduling
- Bidirectional routes

### 3. QR Code Ticketing
- Digital ticket generation
- QR code scanning for validation
- Fare calculation based on distance and train type

### 4. Delay Prediction
- AI-powered delay prediction
- Risk level assessment
- Historical data analysis

### 5. Role-based Access
- Three distinct user roles
- Secure authentication
- Role-specific features and permissions

## Technical Stack

### Frontend
- React Native 0.72+
- Expo SDK 49+
- Redux Toolkit
- React Navigation 6
- React Native Paper
- react-native-maps
- react-native-qrcode-svg

### Backend
- Node.js 14+
- Express.js 4.18+
- Mongoose 7.0+
- CORS middleware
- dotenv for environment variables

### Database
- MongoDB Atlas
- 7 collections with relationships
- Automatic indexing and optimization

## Security Features

- CORS configuration for mobile development
- Role-based access control
- Google OAuth integration
- Secure MongoDB connection
- Environment variable protection

## Development Notes

- Real-time features use polling (upgradable to WebSockets)
- Maps integration with react-native-maps
- QR code generation and scanning
- Location services with expo-location
- Theme support (light/dark modes)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string in `server/.env`
   - Verify IP whitelist in MongoDB Atlas
   - Test connection with `node test-connection.js`

2. **Port Already in Use**
   - Change PORT in `server/.env`
   - Kill existing processes on port 5001

3. **Expo Connection Issues**
   - Ensure devices are on same network
   - Use IP address from server output
   - Check firewall settings

4. **Database Setup Errors**
   - Verify all dependencies are installed
   - Check MongoDB connection string
   - Ensure data files exist

## Next Steps

1. **Testing**: Test all user roles and functionalities
2. **Customization**: Modify train schedules and stations as needed
3. **Enhancement**: Add real-time WebSocket connections
4. **Deployment**: Deploy to production with proper security measures
5. **Monitoring**: Implement logging and monitoring systems

## Support

For detailed setup instructions, see `database/README.md`
For API documentation, check the server routes
For mobile app features, refer to the React Native components

---

**The Intelligent LRT solution is now ready for deployment and use!** 