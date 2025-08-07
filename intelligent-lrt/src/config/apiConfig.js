// API Configuration for Intelligent LRT

// Centralized API configuration for the Intelligent LRT app
import axios from 'axios';
import { Platform } from 'react-native';

// Server port - this should match the port your backend is running on
const SERVER_PORT = 5001;

// Dynamic IP detection for different platforms
const getLocalIPAddress = () => {
  // For Android emulator, use 10.0.2.2
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  
  // For iOS simulator, use localhost
  if (Platform.OS === 'ios') {
    return 'localhost';
  }
  
  // For physical devices, we'll try multiple IPs
  return null;
};

// Common IP addresses to try
const IP_ADDRESSES_TO_TRY = [
  // Primary IP address
  '10.34.215.44',  // Main server IP
  
  // Platform-specific IPs
  ...(Platform.OS === 'android' ? ['10.0.2.2'] : []),
  ...(Platform.OS === 'ios' ? ['localhost'] : []),
  
  // Current network IPs
  '192.168.153.49',  // Current main network IP
  '192.168.56.1',    // VirtualBox network IP
  
  // Common development IPs
  '192.168.86.1',  // Local server IP
  '192.168.1.100',
  '192.168.1.101',
  '192.168.1.102',
  '192.168.8.156',
  '192.168.8.128',
  '192.168.0.100',
  '192.168.0.101',
  '192.168.0.102',
  '10.0.0.100',
  '10.0.0.101',
  '10.0.0.102',
  
  
  // Localhost variants
  'localhost',
  '127.0.0.1',
  
  // Genymotion and other emulator IPs
  '10.0.3.2',
  '10.0.2.2'
];

// Track the last working IP for caching purposes
let lastWorkingIp = null;
let connectionTestPromise = null;

// Find working IP with improved retry logic
const findWorkingIp = async () => {
  // If we have a cached working IP, try it first
  if (lastWorkingIp) {
    try {
      const response = await axios.get(`http://${lastWorkingIp}:${SERVER_PORT}/test`, { 
        timeout: 2000 
      });
      if (response.status === 200) {
        console.log(`✅ Using cached working IP: ${lastWorkingIp}`);
        return lastWorkingIp;
      }
    } catch (_error) {
      console.log(`❌ Cached IP ${lastWorkingIp} failed, trying others...`);
      lastWorkingIp = null;
    }
  }
  
  // Try the primary IP first (10.34.215.44)
  try {
    console.log(`🔍 Trying primary IP: 10.34.215.44`);
    const response = await axios.get(`http://10.34.215.44:${SERVER_PORT}/test`, { 
      timeout: 2000 
    });
    if (response.status === 200) {
      lastWorkingIp = '10.34.215.44';
      console.log(`✅ Primary IP 10.34.215.44 works!`);
      return '10.34.215.44';
    }
  } catch (_error) {
    console.log(`❌ Primary IP 10.34.215.44 failed, trying others...`);
  }
  
  // Try platform-specific IP first
  const platformIP = getLocalIPAddress();
  if (platformIP) {
    try {
      console.log(`🔍 Trying platform-specific IP: ${platformIP}`);
      const response = await axios.get(`http://${platformIP}:${SERVER_PORT}/test`, { 
        timeout: 2000 
      });
      if (response.status === 200) {
        lastWorkingIp = platformIP;
        console.log(`✅ Platform IP ${platformIP} works!`);
        return platformIP;
      }
    } catch (_error) {
      console.log(`❌ Platform IP ${platformIP} failed`);
    }
  }
  
  // Try all IP addresses
  for (const ip of IP_ADDRESSES_TO_TRY) {
    try {
      console.log(`🔍 Trying IP: ${ip}`);
      const response = await axios.get(`http://${ip}:${SERVER_PORT}/test`, { 
        timeout: 2000 
      });
      if (response.status === 200) {
        lastWorkingIp = ip;
        console.log(`✅ IP ${ip} works!`);
        return ip;
      }
    } catch (error) {
      console.log(`❌ IP ${ip} failed: ${error.message}`);
    }
  }
  
  // If all fail, return a default IP
  console.log(`⚠️ All IPs failed, using default IP`);
  return 'localhost';
};

// Base URL for API calls with improved error handling
export const getServerBaseUrl = async () => {
  try {
    // Prevent multiple simultaneous connection tests
    if (connectionTestPromise) {
      return await connectionTestPromise;
    }
    
    connectionTestPromise = findWorkingIp().then(ip => {
      const baseUrl = `http://${ip}:${SERVER_PORT}`;
      console.log(`🌐 Using server base URL: ${baseUrl}`);
      connectionTestPromise = null;
      return baseUrl;
    });
    
    return await connectionTestPromise;
  } catch (error) {
    console.error('❌ Error getting server base URL:', error);
    connectionTestPromise = null;
    // Fallback to localhost
    return `http://localhost:${SERVER_PORT}`;
  }
};

// Base URL for the train-related API endpoints
export const getApiBaseUrl = async () => {
  try {
    const baseUrl = await getServerBaseUrl();
    console.log(`🔗 Using API base URL: ${baseUrl}`);
    return baseUrl;
  } catch (error) {
    console.error('❌ Error getting API base URL:', error);
    // Fallback to localhost
    return `http://localhost:${SERVER_PORT}`;
  }
};

// Helper function to get the current server IP (for debugging)
export const getCurrentServerIP = () => {
  return lastWorkingIp || 'unknown';
};

// Helper function to test server connection with detailed logging
export const testServerConnection = async () => {
  try {
    console.log('🧪 Testing server connection...');
    const baseUrl = await getServerBaseUrl();
    const response = await axios.get(`${baseUrl}/test`, { timeout: 5000 });
    console.log('✅ Server connection successful!');
    return {
      success: true,
      baseUrl,
      response: response.data,
      ip: getCurrentServerIP()
    };
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    return {
      success: false,
      error: error.message,
      baseUrl: `http://localhost:${SERVER_PORT}`,
      ip: getCurrentServerIP()
    };
  }
};

// Force refresh connection (useful for debugging)
export const refreshServerConnection = () => {
  lastWorkingIp = null;
  connectionTestPromise = null;
  console.log('🔄 Forced server connection refresh');
};
