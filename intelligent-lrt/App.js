import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Main App component
export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </ReduxProvider>
  );
}

// Root component to access theme context
const Root = () => {
  const { isDarkMode } = useTheme();
  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </SafeAreaProvider>
  );
};
