import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import SimpleMap from '../../components/SimpleMap';
import { 
  getTrainsWithLocations, 
  getStationsWithCoordinates, 
  updateTrainLocation,
  updateStationLocation,
  findNearestStation 
} from '../../services/trainLocationService';
import realtimeService from '../../services/realtimeService';
import { routes } from '../../data/sriLankaRailway';

const AdminTrackingScreen = () => {
  const { colors, isDarkMode } = useTheme();
  
  // Generate dynamic styles based on theme
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [showManualLocationModal, setShowManualLocationModal] = useState(false);
  const [selectedTrainForUpdate, setSelectedTrainForUpdate] = useState('');
  const [selectedStationForUpdate, setSelectedStationForUpdate] = useState('');

  // Using Sri Lanka Railway data from our data file - with null checks
  const mainRoute = routes && routes.length > 0 ? routes[0] : null; // The single route from Ragama to Kirulapone

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        // Get current location for reference
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      } catch (error) {
        console.log('Location permission or access error:', error);
        setErrorMsg('Unable to access location. Location features will be limited.');
      }
    })();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const trainsData = await getTrainsWithLocations();
        const stationsData = await getStationsWithCoordinates();
        console.log('AdminTrackingScreen - Trains loaded:', trainsData);
        console.log('AdminTrackingScreen - Stations loaded:', stationsData);
        setTrains(trainsData);
        setStations(stationsData);
      } catch (error) {
        console.error('Error loading train data:', error);
        // Show user-friendly error message
        setErrorMsg('Unable to load train data. Using local data instead.');
      }
    };
    
    loadData();
    
    // Refresh data every 30 seconds
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

  useEffect(() => {
    // Set up location tracking
    if (isTracking && selectedTrain) {
      const locationInterval = setInterval(async () => {
        try {
          let location = await Location.getCurrentPositionAsync({});
          console.log(`Sending ${selectedTrain.name} location:`, location.coords);
          
          // Update train location in real-time
          await updateTrainLocation(selectedTrain.id, location.coords.latitude, location.coords.longitude);
          
          // Refresh train data
          const trainsData = await getTrainsWithLocations();
          setTrains(trainsData);
        } catch (error) {
          console.log('Error getting location for tracking:', error);
        }
      }, 10000); // Every 10 seconds
      
      return () => clearInterval(locationInterval);
    }
  }, [isTracking, selectedTrain]);

  // Handle train selection for tracking
  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    setIsTracking(false);
  };

  const toggleTracking = () => {
    if (!selectedTrain) {
      Alert.alert('Select a Train', 'Please select a train before starting tracking.');
      return;
    }
    
    if (!isTracking) {
      Alert.alert(
        'Start Tracking',
        `Are you sure you want to start sharing location for ${selectedTrain.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          { 
            text: 'Start', 
            onPress: () => {
              setIsTracking(true);
              Alert.alert('Tracking Started', `You are now sharing the location for ${selectedTrain.name}`);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Stop Tracking',
        `Are you sure you want to stop sharing location for ${selectedTrain.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          { 
            text: 'Stop', 
            onPress: () => {
              setIsTracking(false);
              Alert.alert('Tracking Stopped', `You are no longer sharing the location for ${selectedTrain.name}`);
            }
          }
        ]
      );
    }
  };

  // Handle station arrival reporting
  const handleStationArrival = (station) => {
    if (!selectedTrain) {
      Alert.alert('No Train Selected', 'Please select a train first');
      return;
    }
    
    Alert.alert(
      'Report Train Arrival',
      `Report that ${selectedTrain.name} has arrived at ${station.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Report Arrival', 
          onPress: () => reportTrainArrival(station)
        }
      ]
    );
  };

  const reportTrainArrival = async (station) => {
    // Update train location to station location
    if (station.coordinates) {
      await updateTrainLocation(selectedTrain.id, station.coordinates.latitude, station.coordinates.longitude);
      
      // Refresh train data
      const trainsData = await getTrainsWithLocations();
      setTrains(trainsData);
      
      Alert.alert('Success', `${selectedTrain.name} marked as arrived at ${station.name}`);
    }
  };

  const openMoveTrainModal = () => {
    setSelectedTrainForUpdate('');
    setSelectedStationForUpdate('');
    setShowManualLocationModal(true);
  };

  const moveTrainToStation = async () => {
    if (!selectedTrainForUpdate) {
      Alert.alert('Error', 'Please select a train');
      return;
    }

    if (!selectedStationForUpdate) {
      Alert.alert('Error', 'Please select a station');
      return;
    }

    try {
      // Find the selected station to get its coordinates
      const selectedStation = stations.find(station => station.id === selectedStationForUpdate);
      if (!selectedStation || !selectedStation.coordinates) {
        Alert.alert('Error', 'Selected station coordinates not found');
        return;
      }

      const { latitude, longitude } = selectedStation.coordinates;
      
      await updateTrainLocation(selectedTrainForUpdate, latitude, longitude);
      
      // Refresh train data
      const trainsData = await getTrainsWithLocations();
      setTrains(trainsData);
      
      Alert.alert(
        'Train Moved Successfully', 
        `Train ${selectedTrainForUpdate} moved to ${selectedStation.name} successfully!`
      );
      
      setShowManualLocationModal(false);
      setSelectedTrainForUpdate('');
      setSelectedStationForUpdate('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const updateTrainStatus = async (trainId, status) => {
    try {
      await updateTrainLocation(trainId, null, null, status); // Update only status
      const trainsData = await getTrainsWithLocations();
      setTrains(trainsData);
      Alert.alert('Success', `Train status updated to ${status}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to find nearest station name
  const getNearestStationName = (train) => {
    if (!train.currentLocation?.coordinates || !stations.length) return 'Unknown Location';
    
    let nearestStation = null;
    let minDistance = Infinity;
    
    stations.forEach(station => {
      if (station.coordinates) {
        const distance = Math.sqrt(
          Math.pow(train.currentLocation.coordinates.latitude - station.coordinates.latitude, 2) +
          Math.pow(train.currentLocation.coordinates.longitude - station.coordinates.longitude, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestStation = station;
        }
      }
    });
    
    return nearestStation ? nearestStation.name : 'Unknown Location';
  };

  const renderTrainCard = (train) => (
    <TouchableOpacity
      key={train.id}
      style={[
        styles.trainCard,
        { backgroundColor: isDarkMode ? colors.cardDark : '#fff' },
        selectedTrain?.id === train.id && styles.selectedTrainCard
      ]}
      onPress={() => handleTrainSelect(train)}
    >
      <View style={styles.trainCardHeader}>
        <Ionicons 
          name={train.type === 'intercity' ? 'train' : 'train-outline'} 
          size={24} 
          color={selectedTrain?.id === train.id ? '#fff' : colors.primary} 
        />
        <Text style={[
          styles.trainName,
          { color: selectedTrain?.id === train.id ? '#fff' : (isDarkMode ? colors.textLight : colors.textDark) }
        ]}>
          {train.name}
        </Text>
        <View style={[
          styles.trainTypeBadge,
          { backgroundColor: train.type === 'intercity' ? '#e74c3c' : train.type === 'express' ? '#3498db' : '#2ecc71' }
        ]}>
          <Text style={styles.trainTypeText}>{train.type}</Text>
        </View>
      </View>
      
      <Text style={[
        styles.trainRoute,
        { color: selectedTrain?.id === train.id ? '#fff' : (isDarkMode ? '#aaa' : '#666') }
      ]}>
        Route: {train.route}
      </Text>
      
      <Text style={[
        styles.trainStatus,
        { color: selectedTrain?.id === train.id ? '#fff' : (isDarkMode ? '#aaa' : '#666') }
      ]}>
        Status: {train.status}
      </Text>
      
      <Text style={[
        styles.trainLocation,
        { color: selectedTrain?.id === train.id ? '#fff' : (isDarkMode ? '#aaa' : '#666') }
      ]}>
        Current Station: {getNearestStationName(train)}
      </Text>
    </TouchableOpacity>
  );

  const renderStationCard = (station, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.stationCard,
        { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }
      ]}
      onPress={() => handleStationArrival(station)}
    >
      <View style={styles.stationCardHeader}>
        <View style={[
          styles.stationDot,
          { backgroundColor: station.stationType === 'intercity' ? '#e74c3c' : station.stationType === 'express' ? '#3498db' : '#2ecc71' }
        ]} />
        <Text style={[
          styles.stationName,
          { color: isDarkMode ? colors.textLight : colors.textDark }
        ]}>
          {station.name}
        </Text>
        {station.code && (
          <Text style={[
            styles.stationCode,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            ({station.code})
          </Text>
        )}
      </View>
      
      <Text style={[
        styles.stationType,
        { color: isDarkMode ? '#aaa' : '#666' }
      ]}>
        Type: {station.stationType || 'regular'}
      </Text>
      
      <TouchableOpacity
        style={[styles.arrivalButton, { backgroundColor: colors.primary }]}
        onPress={() => handleStationArrival(station)}
      >
        <Text style={styles.arrivalButtonText}>Mark Train Arrival</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight }]}>
      {/* Display error message when location permissions are denied */}
      {errorMsg ? (
        <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? colors.cardDark : '#f8d7da' }]}>
          <Text style={[styles.errorText, { color: isDarkMode ? '#ff6b6b' : '#721c24' }]}>{errorMsg}</Text>
        </View>
      ) : null}
      
      {/* Map View */}
      {showMap && (
        <View style={styles.mapContainer}>
          <SimpleMap
            trains={trains}
            stations={stations}
            selectedTrain={selectedTrain}
            onTrainSelect={handleTrainSelect}
            onStationSelect={handleStationArrival}
            getNearestStationName={getNearestStationName}
            style={styles.map}
          />
          
          {/* Map Controls */}
          {selectedTrain && (
            <View style={styles.floatingControls}>
              <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: isTracking ? '#e74c3c' : '#2ecc71' }]}
                onPress={toggleTracking}
              >
                <Ionicons name={isTracking ? "stop-circle" : "location"} size={28} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: '#f39c12' }]}
                onPress={() => updateTrainStatus(selectedTrain.id, 'On Time')}
              >
                <Ionicons name="checkmark-circle" size={28} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: '#e74c3c' }]}
                onPress={() => updateTrainStatus(selectedTrain.id, 'Delayed')}
              >
                <Ionicons name="alert-circle" size={28} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: '#3498db' }]}
                onPress={openMoveTrainModal}
              >
                <Ionicons name="business" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Floating Train Info Panel */}
          {selectedTrain && (
            <View style={[styles.floatingInfoPanel, { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }]}>
              <View style={styles.trainInfoHeader}>
                <Ionicons name="train" size={24} color={colors.primary} />
                <Text style={[styles.trainInfoTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                  {selectedTrain.name}
                </Text>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: selectedTrain.status === 'On Time' ? '#27ae60' : 
                                   selectedTrain.status === 'Delayed' ? '#f39c12' : '#e74c3c' }
                ]} />
              </View>
              <Text style={[styles.trainInfoText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                🚂 {selectedTrain.type} • Route: {selectedTrain.route}
              </Text>
              <Text style={[styles.trainInfoText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                📍 Location: {getNearestStationName(selectedTrain)}
              </Text>
              <Text style={[styles.trainInfoText, { 
                color: selectedTrain.status === 'On Time' ? '#27ae60' : 
                       selectedTrain.status === 'Delayed' ? '#f39c12' : '#e74c3c',
                fontWeight: 'bold'
              }]}>
                ⏰ Status: {selectedTrain.status}
              </Text>
              {isTracking && (
                <Text style={[styles.trainInfoText, { color: '#2ecc71', fontWeight: 'bold' }]}>
                  🔴 Live Tracking Active
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* List View */}
      {!showMap && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Location Info */}
          {currentLocation && (
            <View style={[styles.locationCard, { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }]}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                Current Location
              </Text>
              <Text style={[styles.locationText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
            </View>
          )}

          {/* Train Selection Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
              Select Train to Track ({trains.length})
            </Text>
            <View style={styles.trainList}>
              {trains.map(renderTrainCard)}
            </View>
          </View>

          {/* Selected Train Info */}
          {selectedTrain && (
            <View style={[styles.selectedTrainSection, { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }]}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                Currently Tracking: {selectedTrain.name}
              </Text>
              <Text style={[styles.trainInfo, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {selectedTrain.trainId} - {selectedTrain.type}
              </Text>
              <Text style={[styles.trainRoute, { color: isDarkMode ? '#aaa' : '#666' }]}>
                Route: {selectedTrain.route}
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  isTracking 
                  ? [styles.stopButton, { backgroundColor: '#e74c3c' }] 
                  : [styles.startButton, { backgroundColor: '#2ecc71' }]
                ]}
                onPress={toggleTracking}
              >
                <Ionicons name={isTracking ? "stop-circle" : "location"} size={20} color="#fff" />
                <Text style={styles.trackingButtonText}>
                  {isTracking ? "Stop Location Sharing" : "Start Location Sharing"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Stations Section */}
          {selectedTrain && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                Stations on Route ({selectedTrain.stations.length})
              </Text>
              <View style={styles.stationList}>
                {selectedTrain.stations.map(renderStationCard)}
              </View>
            </View>
          )}

          {/* All Stations Overview */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
              All Stations ({stations.length})
            </Text>
            <View style={styles.stationList}>
              {stations.slice(0, 10).map((station, index) => renderStationCard(station, index))}
              {stations.length > 10 && (
                <Text style={[styles.moreStationsText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  ... and {stations.length - 10} more stations
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* List View Controls */}
      {!showMap && (
        <View style={[styles.listControls, { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }]}>
          <TouchableOpacity
            style={[styles.mapControlButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.mapControlButtonText}>Map View</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Manual Location Edit Modal */}
      <Modal
        visible={showManualLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? colors.cardDark : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
              Move Train to Station
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                Select Train:
              </Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                borderColor: isDarkMode ? '#555' : '#ddd'
              }]}>
                <Picker
                  selectedValue={selectedTrainForUpdate}
                  onValueChange={(itemValue) => setSelectedTrainForUpdate(itemValue)}
                  style={[styles.picker, { color: isDarkMode ? colors.textLight : colors.textDark }]}
                >
                  <Picker.Item label="Select a train..." value="" />
                  {trains.map((train) => (
                    <Picker.Item 
                      key={train.id} 
                      label={`${train.name} (${train.id})`} 
                      value={train.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
                Select Station:
              </Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                borderColor: isDarkMode ? '#555' : '#ddd'
              }]}>
                <Picker
                  selectedValue={selectedStationForUpdate}
                  onValueChange={(itemValue) => setSelectedStationForUpdate(itemValue)}
                  style={[styles.picker, { color: isDarkMode ? colors.textLight : colors.textDark }]}
                >
                  <Picker.Item label="Select a station..." value="" />
                  {stations.map((station) => (
                    <Picker.Item 
                      key={station.id} 
                      label={`${station.name} (${station.code})`} 
                      value={station.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#6c757d' }]}
                onPress={() => setShowManualLocationModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={moveTrainToStation}
              >
                <Text style={styles.modalButtonText}>Move Train</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Create dynamic styles that use theme colors
const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    padding: 15,
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDarkMode ? '#ff6b6b' : '#f5c6cb',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  locationCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationText: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  trainList: {
    gap: 12,
  },
  trainCard: {
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTrainCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  trainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trainName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  trainTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trainTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trainRoute: {
    fontSize: 14,
    marginBottom: 5,
  },
  trainStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  trainLocation: {
    fontSize: 12,
  },
  selectedTrainSection: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trainInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  trackingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stationList: {
    gap: 12,
  },
  stationCard: {
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  stationCode: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  stationType: {
    fontSize: 14,
    marginBottom: 10,
  },
  stationLocation: {
    fontSize: 12,
    marginBottom: 10,
  },
  stationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  arrivalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  arrivalButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editStationLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  editStationLocationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  moreStationsText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 10,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mapControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  mapControlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
  },
  editLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
  },
  editLocationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  picker: {
    fontSize: 16,
  },
  trainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  trainControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  trainControlButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  floatingControls: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  floatingInfoPanel: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    zIndex: 10,
    padding: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  trainInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  trainInfoText: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22,
  },
});

export default AdminTrackingScreen;
