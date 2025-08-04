# Intelligent Light Rail Transit (LRT) Management System 🚄

A comprehensive mobile application for managing and operating light rail transit systems, built with Expo and React Native.

## Features

### Multi-Role Access
- **User**: Book tickets, track trains in real-time, and view delay predictions
- **Admin**: Monitor train status and manage train operations
- **Super Admin**: Full system control including timetable management, train management, and pricing management

### Key Components
- **Real-time Train Tracking**: Monitor train positions and status updates
- **Smart Delay Prediction**: ML-powered train delay forecasting based on various factors
- **Schedule Management**: Create and modify train schedules for different day types
- **Dynamic Pricing**: Configure route pricing and special passes
- **Secure Authentication**: Role-based access control via Google Sign-in

## Getting Started

### Prerequisites
- Node.js 16.x or later
- Expo CLI (`npm install -g expo-cli`)
- Android Studio or Xcode for emulation

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/intelligent-lrt.git
   cd intelligent-lrt
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npx expo start
   ```

4. Use Expo Go on your physical device by scanning the QR code or launch in an emulator

## Project Structure

```
intelligent-lrt/
├── src/
│   ├── navigation/       # Navigation configuration
│   ├── redux/
│   │   ├── slices/       # Redux state management slices
│   │   └── store.js      # Redux store configuration
│   ├── screens/
│   │   ├── auth/         # Authentication screens
│   │   ├── user/         # User role screens
│   │   ├── admin/        # Admin role screens
│   │   └── superAdmin/   # Super Admin role screens
│   └── services/         # API and other services
├── assets/              # Images, fonts, etc.
└── app.json            # Expo configuration
```

## Super Admin Features

### Dashboard
Provides an overview of the entire LRT system including metrics, recent activities, and quick access to management functions.

### Timetable Management
Create, edit, and delete train schedules for different day types (Weekday, Weekend, Holiday).

### Train Management
Add, edit, and delete trains. Monitor train status, maintenance schedules, and assign administrators.

### Pricing Management
Set and modify route prices and manage special pass options.

### Delay Predictions
View system-wide delay predictions and analyze factors affecting train delays.

## Technologies Used

- **Frontend**: React Native, Expo
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Authentication**: Expo Auth Session with Google Sign-in
- **Navigation**: React Navigation v7
- **API Communication**: Axios

## Future Enhancements

- Integration with real backend services
- Push notifications for delay alerts
- Advanced analytics dashboard
- Passenger load prediction
- QR-based ticket validation system
- Offline functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
