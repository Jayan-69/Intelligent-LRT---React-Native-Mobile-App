import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { testServerConnection, getCurrentServerIP } from '../config/apiConfig';

const ServerConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [isLoading, setIsLoading] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    
    try {
      const result = await testServerConnection();
      setConnectionInfo(result);
      
      if (result.success) {
        setConnectionStatus('✅ Connected successfully!');
        Alert.alert(
          'Connection Successful',
          `Server is running at: ${result.baseUrl}\n\nResponse: ${JSON.stringify(result.response, null, 2)}`
        );
      } else {
        setConnectionStatus('❌ Connection failed');
        Alert.alert(
          'Connection Failed',
          `Error: ${result.error}\n\nTrying to connect to: ${result.baseUrl}\n\nPlease make sure:\n1. Server is running\n2. IP address is correct\n3. Port 5001 is accessible`
        );
      }
    } catch (error) {
      setConnectionStatus('❌ Test failed');
      Alert.alert('Test Error', `Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[
          styles.statusText,
          connectionStatus.includes('✅') ? styles.success : styles.error
        ]}>
          {connectionStatus}
        </Text>
      </View>

      {connectionInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Connection Details:</Text>
          <Text style={styles.infoText}>
            Server IP: {getCurrentServerIP()}
          </Text>
          <Text style={styles.infoText}>
            Port: 5001
          </Text>
          {connectionInfo.baseUrl && (
            <Text style={styles.infoText}>
              Base URL: {connectionInfo.baseUrl}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={testConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Connection Again'}
        </Text>
      </TouchableOpacity>

      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Troubleshooting:</Text>
        <Text style={styles.helpText}>
          1. Make sure server is running: cd server && node server.js
        </Text>
        <Text style={styles.helpText}>
          2. Check if port 5001 is not blocked by firewall
        </Text>
        <Text style={styles.helpText}>
          3. Verify IP address in apiConfig.js matches your computer's IP
        </Text>
        <Text style={styles.helpText}>
          4. Try visiting http://localhost:5001/test in browser
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#F44336',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  helpText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    lineHeight: 20,
  },
});

export default ServerConnectionTest; 