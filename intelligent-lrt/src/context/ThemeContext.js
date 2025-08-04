import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Create Theme Context
export const ThemeContext = createContext();

// Light and dark theme colors
export const lightThemeColors = {
  primary: '#3498db',
  primaryDark: '#2980b9',
  background: '#f4f6f8',
  surface: '#ffffff',
  text: '#2c3e50',
  textLight: '#ffffff',
  placeholder: '#95a5a6',
  tabBarActive: '#3498db',
  tabBarInactive: '#95a5a6',
  headerBackground: '#3498db',
  headerText: '#ffffff',
  border: '#dddddd',
  card: '#ffffff',
  shadow: 'rgba(0, 0, 0, 0.1)',
  statusBar: 'dark',
  buttonBackground: '#3498db',
  buttonText: '#ffffff',
  error: '#e74c3c',
  success: '#27ae60',
  warning: '#f39c12',
};

export const darkThemeColors = {
  primary: '#3498db',  // Keep blue as primary color even in dark mode
  primaryDark: '#1a2530',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ecf0f1',
  textLight: '#ecf0f1',
  placeholder: '#7f8c8d',
  tabBarActive: '#3498db',
  tabBarInactive: '#7f8c8d',
  headerBackground: '#2c3e50',
  headerText: '#ecf0f1',
  border: '#333333',
  card: '#1e1e1e',
  shadow: 'rgba(0, 0, 0, 0.3)',
  statusBar: 'light',
  buttonBackground: '#2c3e50',
  buttonText: '#ecf0f1',
  error: '#e74c3c',
  success: '#27ae60',
  warning: '#f39c12',
};

export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');
  
  useEffect(() => {
    setIsDarkMode(deviceColorScheme === 'dark');
  }, [deviceColorScheme]);
  
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const colors = isDarkMode ? darkThemeColors : lightThemeColors;
  
  // Create theme object with colors property for consistency
  const theme = {
    isDarkMode,
    colors,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
