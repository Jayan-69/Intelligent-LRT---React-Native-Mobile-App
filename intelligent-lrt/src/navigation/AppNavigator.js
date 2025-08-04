import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

// Import ThemeContext utility
import { useTheme } from '../context/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';

// User Screens
import UserDashboardScreen from '../screens/user/UserDashboardScreen';
import UserTicketScreen from '../screens/user/UserTicketScreen';
import UserTrackingScreen from '../screens/user/UserTrackingScreen';
import UserNoticesScreen from '../screens/user/UserNoticesScreen';
import UserSchedulesScreen from '../screens/user/UserSchedulesScreen';
import DelayPredictionScreen from '../screens/user/DelayPredictionScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminTrackingScreen from '../screens/admin/AdminTrackingScreen';
import StationManagementScreen from '../screens/admin/StationManagementScreen';

// Super Admin Screens
import SuperAdminDashboardScreen from '../screens/superAdmin/SuperAdminDashboardScreen';
import TrainManagementScreen from '../screens/superAdmin/TrainManagementScreen';
import TrainScheduleManagementScreen from '../screens/superAdmin/TrainScheduleManagementScreen';
import NoticeManagementScreen from '../screens/superAdmin/NoticeManagementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Reusable HeaderTitle component
const HeaderTitle = ({ title, isDarkMode }) => (
  <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#000' }}>
    {title}
  </Text>
);

// Logout Button Component
const LogoutButton = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const handleLogout = () => dispatch(logout());

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
      <Ionicons name="log-out-outline" size={24} color={isDarkMode ? '#FFF' : '#000'} />
    </TouchableOpacity>
  );
};

// Theme Toggle Button Component
const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={isDarkMode ? '#FFF' : '#000'} />
    </TouchableOpacity>
  );
};

// Common Screen Options for Tab Navigators
const commonScreenOptions = (isDarkMode) => ({
  headerStyle: { backgroundColor: isDarkMode ? '#121212' : '#FFF' },
  headerTitleStyle: { color: isDarkMode ? '#FFF' : '#000' },
  headerRight: () => (
    <View style={{ flexDirection: 'row' }}>
      <ThemeToggleButton />
      <LogoutButton />
    </View>
  ),
});

// Role-based Tab Navigators
const UserTabNavigator = () => {
  const { isDarkMode } = useTheme();
  return (
    <Tab.Navigator screenOptions={{ ...commonScreenOptions(isDarkMode), headerShown: true }}>
      <Tab.Screen 
        name="Dashboard" 
        component={UserDashboardScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Dashboard" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Tickets" 
        component={UserTicketScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Your Tickets" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="ticket" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Live Tracking" 
        component={UserTrackingScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Live Tracking" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="location" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Schedules" 
        component={UserSchedulesScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Train Schedules" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Notices" 
        component={UserNoticesScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Notices & Updates" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
};

const AdminTabNavigator = () => {
  const { isDarkMode } = useTheme();
  return (
    <Tab.Navigator screenOptions={{ ...commonScreenOptions(isDarkMode), headerShown: true }}>
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Admin Dashboard" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Tracking" 
        component={AdminTrackingScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Live Train Tracking" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="location" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Station Management" 
        component={StationManagementScreen} 
        options={{ 
          headerTitle: () => <HeaderTitle title="Station Management" isDarkMode={isDarkMode} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="business" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
};

const SuperAdminTabNavigator = () => {
  const { isDarkMode } = useTheme();
  
  try {
    console.log('Creating SuperAdminTabNavigator...');
    return (
      <Tab.Navigator screenOptions={{ ...commonScreenOptions(isDarkMode), headerShown: true }}>
        <Tab.Screen 
          name="Dashboard" 
          component={SuperAdminDashboardScreen} 
          options={{ 
            headerTitle: () => <HeaderTitle title="Super Admin Dashboard" isDarkMode={isDarkMode} />,
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
          }} 
        />
        <Tab.Screen 
          name="Train Management" 
          component={TrainManagementScreen} 
          options={{ 
            headerTitle: () => <HeaderTitle title="Train Management" isDarkMode={isDarkMode} />,
            tabBarIcon: ({ color, size }) => <Ionicons name="train" size={size} color={color} />
          }} 
        />
        <Tab.Screen 
          name="Schedule Management" 
          component={TrainScheduleManagementScreen} 
          options={{ 
            headerTitle: () => <HeaderTitle title="Schedule Management" isDarkMode={isDarkMode} />,
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />
          }} 
        />
        <Tab.Screen 
          name="Notice Management" 
          component={NoticeManagementScreen} 
          options={{ 
            headerTitle: () => <HeaderTitle title="Notice Management" isDarkMode={isDarkMode} />,
            tabBarIcon: ({ color, size }) => <Ionicons name="megaphone" size={size} color={color} />
          }} 
        />
      </Tab.Navigator>
    );
  } catch (error) {
    console.error('Error in SuperAdminTabNavigator:', error);
    console.error('Error stack:', error.stack);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: '#000', fontSize: 16 }}>Error loading SuperAdmin navigation: {error.message}</Text>
        <Text style={{ color: '#666', fontSize: 12, marginTop: 10 }}>{error.stack}</Text>
      </View>
    );
  }
};

// Main App Stack (Authenticated Users)
const MainStack = () => {
  const { role } = useSelector((state) => state.auth);
  
  try {
    switch (role) {
      case 'user': return <UserTabNavigator />;
      case 'admin': return <AdminTabNavigator />;
      case 'superadmin': return <SuperAdminTabNavigator />;
      default: return null; // Or a fallback screen
    }
  } catch (error) {
    console.error('Error in MainStack:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading navigation: {error.message}</Text>
      </View>
    );
  }
};

// Auth Stack (Unauthenticated Users)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Hook to track previous state
function usePrevious(value) {
  const ref = React.useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// Root component to decide which stack to show
const RootNavigator = () => {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const prevIsAuthenticated = usePrevious(isAuthenticated);
  const { isDarkMode } = useTheme();
  const navigationTheme = isDarkMode ? DarkTheme : DefaultTheme;

  useEffect(() => {
    if (isAuthenticated && !prevIsAuthenticated && user) {
      const roleName = role.charAt(0).toUpperCase() + role.slice(1);
      Alert.alert('Welcome!', `Logged in as ${user.name} (${roleName})`);
    }
  }, [isAuthenticated, prevIsAuthenticated, user, role]);

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Main App Component
const AppNavigator = () => (
  <RootNavigator />
);

export default AppNavigator;
