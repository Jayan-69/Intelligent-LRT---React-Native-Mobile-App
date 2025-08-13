import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import SimpleMap from '../../components/SimpleMap';
import { getTrainsWithLocations, getStationsWithCoordinates } from '../../services/trainLocationService';
import realtimeService from '../../services/realtimeService';

const UserTrackingScreen = () => {
  const { colors } = useTheme();
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const trainsData = await getTrainsWithLocations();
        const stationsData = await getStationsWithCoordinates();
        console.log('UserTrackingScreen - Trains loaded:', trainsData);
        console.log('UserTrackingScreen - Stations loaded:', stationsData);
        setTrains(trainsData);
        setStations(stationsData);
      } catch (error) {
        console.error('Error loading train data:', error);
        // Continue with empty data rather than crashing
        setTrains([]);
        setStations([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadData, 30000);
    
    // Set up real-time update listeners
    const handleLocationUpdate = async () => {
      await loadData();
    };
    
    const handleTrainLocationUpdate = async (data) => {
      console.log('Train location updated:', data);
      await loadData();
    };
    
    const handleStationLocationUpdate = async (data) => {
      console.log('Station location updated:', data);
      await loadData();
    };
    
    realtimeService.onLocationUpdate(handleLocationUpdate);
    realtimeService.onTrainLocationUpdate(handleTrainLocationUpdate);
    realtimeService.onStationLocationUpdate(handleStationLocationUpdate);
    
    // Start real-time updates
    realtimeService.startUpdates(15000); // 15 seconds
    
    return () => {
      clearInterval(interval);
      realtimeService.unsubscribe('locationUpdate', handleLocationUpdate);
      realtimeService.unsubscribe('trainLocationUpdate', handleTrainLocationUpdate);
      realtimeService.unsubscribe('stationLocationUpdate', handleStationLocationUpdate);
      realtimeService.stopUpdates();
    };
  }, []);

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
  };

  const handleStationSelect = (station) => {
    console.log('Station selected:', station.name);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Live Tracking</Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>Track your train in real-time</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading live locations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Live Tracking</Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>Track your train in real-time</Text>
      </View>
      
      <View style={styles.mapContainer}>
        <SimpleMap
          trains={trains}
          stations={stations}
          selectedTrain={selectedTrain}
          onTrainSelect={handleTrainSelect}
          onStationSelect={handleStationSelect}
          style={styles.map}
        />
      </View>
      
      {selectedTrain && (
        <View style={[styles.trainInfoPanel, { backgroundColor: colors.card }]}>
          <Text style={[styles.trainInfoTitle, { color: colors.text }]}>
            {selectedTrain.name}
          </Text>
          <Text style={[styles.trainInfoText, { color: colors.placeholder }]}>
            Type: {selectedTrain.type}
          </Text>
          <Text style={[styles.trainInfoText, { color: colors.placeholder }]}>
            Route: {selectedTrain.route}
          </Text>
          <Text style={[styles.trainInfoText, { color: colors.placeholder }]}>
            Status: {selectedTrain.status}
          </Text>
          <Text style={[styles.trainInfoText, { color: colors.placeholder }]}>
            Location: {selectedTrain.currentLocation.coordinates.latitude.toFixed(4)}, {selectedTrain.currentLocation.coordinates.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  trainInfoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  trainInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trainInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default UserTrackingScreen;
