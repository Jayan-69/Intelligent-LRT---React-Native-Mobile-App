# React Native Setup Guide

## Current Configuration

The Intelligent LRT system has been configured to work optimally in React Native environment with the following setup:

### 🚂 **Train Location Management**
- **Real-time Updates**: Train location changes are immediately visible to all users
- **Manual Location Editing**: Admins can manually set train coordinates
- **Station Arrival Reporting**: Quick way to mark trains as arrived at stations
- **Location Validation**: Coordinates are validated to ensure they're within Sri Lanka bounds

### 📱 **React Native Optimizations**
- **Custom Event System**: Replaced Node.js EventEmitter with React Native compatible custom event system
- **In-Memory Storage**: Using local storage for better performance in mobile environment
- **Error Handling**: Robust error handling for network and database issues
- **Fallback Mechanisms**: Graceful degradation when services are unavailable

## Quick Start

### 1. Start the Application
```bash
cd intelligent-lrt
npx expo start --clear
```

### 2. Access Admin Features
1. Navigate to the Admin Dashboard
2. Select "Train Tracking" from the admin menu
3. You'll see the train tracking interface with map and list views

## Features Available

### ✅ **Admin Capabilities**
- Select any train from the list
- Edit train coordinates manually
- Mark train arrival at stations
- Start/stop real-time GPS tracking
- View all trains and stations on interactive map

### ✅ **Real-time Synchronization**
- Admin changes immediately appear on user maps
- Event-driven updates for instant propagation
- Fallback polling for reliability
- Cross-device synchronization

### ✅ **User Experience**
- Real-time updates on user maps
- No manual refresh required
- Visual confirmation of location changes
- Interactive map with train and station markers

## Technical Details

### **Real-time Service**
- Custom event emitter (React Native compatible)
- No Node.js dependencies
- 15-second polling intervals
- Immediate event propagation

### **Data Storage**
- In-memory storage for optimal performance
- MongoDB integration available (currently disabled for React Native)
- Fallback mechanisms for reliability

### **Error Handling**
- Graceful degradation when services fail
- User-friendly error messages
- Automatic retry mechanisms

## Database Integration

### **Current Status**
- MongoDB integration is available but disabled for React Native
- Using in-memory storage for better mobile performance
- Database seeding script available for server-side setup

### **To Enable MongoDB**
1. Set `USE_MONGODB = true` in `trainLocationService.js`
2. Ensure MongoDB Atlas connection is working
3. Run database seeding script if needed

## Troubleshooting

### **Common Issues**

#### App Won't Start
- Clear Expo cache: `npx expo start --clear`
- Check for Node.js dependencies in React Native code
- Verify all imports are React Native compatible

#### Location Updates Not Working
- Check real-time service status in console
- Verify event listeners are properly set up
- Check for JavaScript errors in console

#### Map Not Loading
- Check internet connection
- Verify map component dependencies
- Check for WebView issues

### **Debug Information**
- Check console logs for real-time service status
- Monitor event emission and reception
- Verify train and station data is loaded

## Performance Notes

### **Optimizations**
- In-memory storage for faster access
- Efficient polling intervals (15 seconds)
- Minimal database queries
- Optimized event system

### **Memory Management**
- Proper cleanup of event listeners
- Interval clearing on component unmount
- Efficient data structures

## Future Enhancements

### **Planned Improvements**
- WebSocket integration for real-time updates
- Offline support with local storage
- Push notifications for location updates
- Background location tracking

### **Database Integration**
- Enable MongoDB for persistent storage
- Real-time database synchronization
- Multi-device data consistency

---

This setup provides a robust, real-time train location management system optimized for React Native mobile applications. 