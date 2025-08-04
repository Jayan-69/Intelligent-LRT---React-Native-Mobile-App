import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboardScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  // Mock data for trains assigned to this admin
  const [assignedTrains, setAssignedTrains] = useState([
    {
      id: '1',
      name: 'Express 101',
      routeFrom: 'Central Station',
      routeTo: 'North Terminal',
      departureTime: '10:00 AM',
      currentStation: 'Central Station',
      nextStation: 'East Hub',
      status: 'On Time',
      passengersCount: 65,
    },
    {
      id: '2',
      name: 'Local 205',
      routeFrom: 'East Hub',
      routeTo: 'West Junction',
      departureTime: '10:15 AM',
      currentStation: 'Not Started',
      nextStation: 'East Hub',
      status: 'Scheduled',
      passengersCount: 0,
    },
  ]);

  // Mock weather data
  const weatherData = {
    temperature: 28,
    condition: 'Partly Cloudy',
    precipitation: '10%',
    wind: '5 km/h',
  };

  // Function to update train status (in a real app, this would make API calls)
  const updateTrainStatus = (trainId, newStatus) => {
    setAssignedTrains(trains => 
      trains.map(train => 
        train.id === trainId 
          ? { ...train, status: newStatus } 
          : train
      )
    );
  };

  // Function to mark train at station
  const markTrainAtStation = (trainId, stationName) => {
    // In a real app, this would call an API to update the train's position
    alert(`Train ${trainId} marked at ${stationName}`);
    
    // For demo, update the current station
    setAssignedTrains(trains => 
      trains.map(train => 
        train.id === trainId 
          ? { 
              ...train, 
              currentStation: stationName,
              nextStation: stationName === 'Central Station' ? 'East Hub' : 
                           stationName === 'East Hub' ? 'North Terminal' : 
                           stationName === 'North Terminal' ? 'Destination Reached' :
                           stationName === 'West Junction' ? 'Destination Reached' :
                           'Unknown'
            } 
          : train
      )
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? colors.backgroundDark : '#f0f4f7' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? colors.headerBackground : '#2c3e50' }]}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Train Conductor Interface</Text>
      </View>
      
      <View style={[styles.weatherCard, { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }]}>
        <View style={styles.weatherHeader}>
          <Text style={[styles.weatherTitle, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>Current Weather</Text>
          <Ionicons name="partly-sunny" size={24} color="#f39c12" />
        </View>
        <View style={styles.weatherDetails}>
          <Text style={[styles.temperature, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>{weatherData.temperature}°C</Text>
          <View style={styles.weatherInfo}>
            <Text style={[styles.weatherCondition, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>{weatherData.condition}</Text>
            <Text style={[styles.weatherData, { color: isDarkMode ? '#bdc3c7' : '#7f8c8d' }]}>Precipitation: {weatherData.precipitation}</Text>
            <Text style={[styles.weatherData, { color: isDarkMode ? '#bdc3c7' : '#7f8c8d' }]}>Wind: {weatherData.wind}</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: isDarkMode ? 'transparent' : '#f0f4f7' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>Your Assigned Trains</Text>
        
        {assignedTrains.map((train) => (
          <View key={train.id} style={[styles.trainCard, { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }]}>
            <View style={styles.trainCardHeader}>
              <Text style={[styles.trainName, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>{train.name}</Text>
              <View style={[
                styles.statusBadge,
                train.status === 'On Time' ? styles.onTimeBadge :
                train.status === 'Delayed' ? styles.delayedBadge :
                train.status === 'Scheduled' ? styles.scheduledBadge :
                styles.completedBadge
              ]}>
                <Text style={styles.statusText}>{train.status}</Text>
              </View>
            </View>
            
            <Text style={[styles.routeText, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>
              <Text style={{ color: isDarkMode ? colors.textLight : '#2c3e50' }}>{train.routeFrom}</Text>
              <Text style={{ color: isDarkMode ? colors.textLight : '#2c3e50' }}> → </Text>
              <Text style={{ color: isDarkMode ? colors.textLight : '#2c3e50' }}>{train.routeTo}</Text>
            </Text>
            <Text style={[styles.departureText, { color: isDarkMode ? '#bdc3c7' : '#7f8c8d' }]}>Departure: {train.departureTime}</Text>
            
            <View style={styles.stationInfo}>
              <View style={styles.stationColumn}>
                <Text style={[styles.stationLabel, { color: isDarkMode ? '#bdc3c7' : '#7f8c8d' }]}>Current Station:</Text>
                <Text style={[styles.stationValue, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>{train.currentStation}</Text>
              </View>
              <View style={styles.stationColumn}>
                <Text style={[styles.stationLabel, { color: isDarkMode ? '#bdc3c7' : '#7f8c8d' }]}>Next Station:</Text>
                <Text style={[styles.stationValue, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>{train.nextStation}</Text>
              </View>
            </View>
            
            <View style={styles.passengerInfo}>
              <Ionicons name="people" size={20} color={isDarkMode ? '#bdc3c7' : '#7f8c8d'} />
              <Text style={[styles.passengerCount, { color: isDarkMode ? '#bdc3c7' : '#7f8c8d' }]}>{train.passengersCount} passengers</Text>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={[styles.sectionSubtitle, { color: isDarkMode ? colors.textLight : '#2c3e50' }]}>Update Train Location</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stationButtons}>
              <TouchableOpacity 
                style={styles.stationButton}
                onPress={() => markTrainAtStation(train.id, 'Central Station')}
              >
                <Text style={styles.stationButtonText}>Central Station</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.stationButton}
                onPress={() => markTrainAtStation(train.id, 'East Hub')}
              >
                <Text style={styles.stationButtonText}>East Hub</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.stationButton}
                onPress={() => markTrainAtStation(train.id, 'North Terminal')}
              >
                <Text style={styles.stationButtonText}>North Terminal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.stationButton}
                onPress={() => markTrainAtStation(train.id, 'West Junction')}
              >
                <Text style={styles.stationButtonText}>West Junction</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.stationButton}
                onPress={() => markTrainAtStation(train.id, 'South Point')}
              >
                <Text style={styles.stationButtonText}>South Point</Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.statusButtons}>
              <TouchableOpacity 
                style={[styles.statusButton, styles.onTimeButton]}
                onPress={() => updateTrainStatus(train.id, 'On Time')}
              >
                <Text style={styles.statusButtonText}>Mark On Time</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, styles.delayButton]}
                onPress={() => updateTrainStatus(train.id, 'Delayed')}
              >
                <Text style={styles.statusButtonText}>Mark Delayed</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.trackingButton} onPress={() => navigation.navigate('AdminTracking')}>
              <Ionicons name="map" size={20} color="#fff" />
              <Text style={styles.trackingButtonText}>Open Tracking Map</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor handled in inline styles for dark mode support
  },
  header: {
    padding: 20,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
    marginTop: 5,
  },
  weatherCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f39c12',
    marginRight: 20,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  weatherData: {
    color: '#7f8c8d',
    marginBottom: 3,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 10,
  },
  trainCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trainName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  onTimeBadge: {
    backgroundColor: '#e9f7ef',
  },
  delayedBadge: {
    backgroundColor: '#fdedec',
  },
  scheduledBadge: {
    backgroundColor: '#eaf2f8',
  },
  completedBadge: {
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeText: {
    color: '#2c3e50',
    marginBottom: 5,
  },
  departureText: {
    color: '#2c3e50',
    marginBottom: 10,
  },
  stationInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stationColumn: {
    flex: 1,
  },
  stationLabel: {
    color: '#7f8c8d',
    marginBottom: 3,
  },
  stationValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  passengerCount: {
    marginLeft: 5,
    color: '#7f8c8d',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 10,
  },
  stationButtons: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  stationButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  stationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  onTimeButton: {
    backgroundColor: '#2ecc71',
    marginRight: 10,
  },
  delayButton: {
    backgroundColor: '#e74c3c',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  trackingButton: {
    backgroundColor: '#34495e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  trackingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AdminDashboardScreen;
