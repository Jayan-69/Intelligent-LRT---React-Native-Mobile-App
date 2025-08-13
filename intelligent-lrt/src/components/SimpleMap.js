import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const SimpleMap = ({ 
  trains = [], 
  stations = [], 
  selectedTrain = null, 
  onTrainSelect = null,
  onStationSelect = null,
  getNearestStationName = null,
  style = {} 
}) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Animation values for legend and controls
  const legendOpacity = useRef(new Animated.Value(1)).current;
  const controlsOpacity = useRef(new Animated.Value(0)).current;
  const [showLegend, setShowLegend] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Auto-hide legend after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(legendOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowLegend(false);
        // Show controls after legend hides
        setShowControls(true);
        Animated.timing(controlsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, [controlsOpacity, legendOpacity]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [controlsOpacity, legendOpacity]);

  // Debug logging
  useEffect(() => {
    console.log('SimpleMap received trains:', trains);
    console.log('SimpleMap received stations:', stations);
  }, [trains, stations]);

  // Fit map to show all markers
  useEffect(() => {
    // Initial map region setup
    if (mapRef.current) {
      // Set a default region first
      setRegion({
        latitude: 6.9271,
        longitude: 79.8612,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
    
    // Delay fitting to coordinates to ensure map is fully rendered
    const timer = setTimeout(() => {
      if (mapRef.current && (trains.length > 0 || stations.length > 0)) {
        const coordinates = [];
        trains.forEach(train => {
          if (train.currentLocation?.coordinates) {
            coordinates.push({
              latitude: train.currentLocation.coordinates.latitude,
              longitude: train.currentLocation.coordinates.longitude,
            });
          }
        });
        stations.forEach(station => {
          if (station.coordinates) {
            coordinates.push({
              latitude: station.coordinates.latitude,
              longitude: station.coordinates.longitude,
            });
          }
        });
        if (coordinates.length > 0) {
          console.log('Fitting map to coordinates');
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [trains, stations]);

  const handleTrainPress = (train) => {
    if (onTrainSelect) {
      onTrainSelect(train);
    }
  };

  const handleStationPress = (station) => {
    if (onStationSelect) {
      onStationSelect(station);
    }
  };

  const getTrainIcon = (train) => {
    const isSelected = selectedTrain && selectedTrain.id === train.id;
    return (
      <View style={styles.trainMarker}>
        <View style={[
          styles.trainIcon, 
          { 
            backgroundColor: isSelected ? '#ff0000' : '#ff4757',
            width: isSelected ? 48 : 40,
            height: isSelected ? 48 : 40,
            borderRadius: isSelected ? 24 : 20,
            borderWidth: isSelected ? 15 : 12,
            shadowOpacity: isSelected ? 0.9 : 0.7,
            shadowRadius: isSelected ? 25 : 20,
            elevation: isSelected ? 25 : 20,
          }
        ]}>
          <Ionicons 
            name="train" 
            size={isSelected ? 24 : 20} 
            color="white" 
          />
        </View>
        <Text style={[styles.trainLabel, { 
          fontSize: isSelected ? 32 : 28,
          color: isSelected ? '#ff0000' : '#ff4757',
          fontWeight: isSelected ? 'bold' : '600'
        }]}>{train.name}</Text>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>SELECTED</Text>
          </View>
        )}
      </View>
    );
  };

  const getStationIcon = (station) => {
    // All stations now use the same icon and size
    const backgroundColor = '#3742fa';
    const iconName = 'business';
    const size = 32; // Stable station icon size

    return (
      <View style={styles.stationMarker}>
        <View style={[styles.stationIcon, { 
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        }]}>
          <Ionicons 
            name={iconName} 
            size={size * 0.4} 
            color="white" 
          />
        </View>
        <Text style={[styles.stationLabel, { 
          fontSize: 36,
          color: backgroundColor,
          fontWeight: 'bold',
          textShadowColor: 'rgba(0, 0, 0, 0.8)',
          textShadowOffset: { width: 3, height: 3 },
          textShadowRadius: 6,
        }]}>{station.name}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        mapType="none"
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        moveOnMarkerPress={false}
      >
        <UrlTile
          // IMPORTANT: Replace YOUR_MAPTILER_API_KEY with your actual MapTiler API key.
          urlTemplate="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=P12gR4SilSvBfSWfTMlK"
          maximumZ={19}
          flipY={false}
        />

        {/* Train Markers */}
        {trains.map((train) => {
          if (train.currentLocation?.coordinates) {
            return (
              <Marker
                key={`train-${train.id}`}
                coordinate={{
                  latitude: train.currentLocation.coordinates.latitude,
                  longitude: train.currentLocation.coordinates.longitude,
                }}
                onPress={() => handleTrainPress(train)}
                tracksViewChanges={false}
              >
                {getTrainIcon(train)}
                <Callout>
                  <View style={styles.callout}>
                    <View style={styles.calloutHeader}>
                      <Text style={styles.calloutTitle}>{train.name}</Text>
                      <View style={[styles.statusBadge, { 
                        backgroundColor: train.status === 'On Time' ? '#27ae60' : 
                                     train.status === 'Delayed' ? '#f39c12' : '#e74c3c' 
                      }]}>
                        <Text style={styles.statusText}>{train.status}</Text>
                      </View>
                    </View>
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutText}>
                        <Text style={styles.calloutLabel}>Type:</Text> {train.type}
                      </Text>
                      <Text style={styles.calloutText}>
                        <Text style={styles.calloutLabel}>Route:</Text> {train.route}
                      </Text>
                      <Text style={styles.calloutText}>
                        <Text style={styles.calloutLabel}>Train ID:</Text> {train.id}
                      </Text>
                      <Text style={styles.calloutText}>
                        <Text style={styles.calloutLabel}>Location:</Text> {getNearestStationName ? getNearestStationName(train) : 'Unknown Location'}
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          }
          return null;
        })}

        {/* Station Markers */}
        {stations.map((station) => {
          if (station.coordinates) {
            return (
              <Marker
                key={`station-${station.id}`}
                coordinate={{
                  latitude: station.coordinates.latitude,
                  longitude: station.coordinates.longitude,
                }}
                onPress={() => handleStationPress(station)}
                tracksViewChanges={false}
              >
                {getStationIcon(station)}
                <Callout>
                  <View style={styles.callout}>
                    <View style={styles.calloutHeader}>
                      <Text style={styles.calloutTitle}>{station.name}</Text>
                      <View style={[styles.statusBadge, { 
                        backgroundColor: station.stationType === 'intercity' ? '#ff6348' : 
                                     station.stationType === 'express' ? '#ffa502' : '#3742fa' 
                      }]}>
                        <Text style={styles.statusText}>{station.stationType || 'regular'}</Text>
                      </View>
                    </View>
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutText}>
                        <Text style={styles.calloutLabel}>Code:</Text> {station.code || 'N/A'}
                      </Text>
                      <Text style={styles.calloutText}>
                        <Text style={styles.calloutLabel}>Station ID:</Text> {station.id}
                      </Text>
                      <Text style={styles.calloutText}>
                        <Text style={styles.calloutLabel}>Location:</Text> {station.name} Station
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          }
          return null;
        })}
      </MapView>

      {/* Animated Legend */}
      {showLegend && (
        <Animated.View style={[styles.legend, { opacity: legendOpacity }]}>
          <Text style={styles.legendTitle}>🚂 Train Map Legend</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff4757' }]} />
            <Text style={styles.legendText}>🚂 Trains (400px)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3742fa' }]} />
            <Text style={styles.legendText}>🏛️ Stations (350px)</Text>
          </View>
          <View style={styles.legendNote}>
            <Text style={styles.legendNoteText}>💡 Tap markers for details</Text>
          </View>
        </Animated.View>
      )}

      {/* Animated Controls */}
      {showControls && (
        <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
          <Text style={styles.controlsTitle}>Train Controls</Text>
          <Text style={styles.controlsSubtitle}>Select a train to manage</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  trainMarker: {
    alignItems: 'center',
  },
  trainIcon: {
    width: 400,
    height: 400,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 20,
  },
  trainLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ff4757',
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  stationMarker: {
    alignItems: 'center',
  },
  stationIcon: {
    width: 350,
    height: 350,
    borderRadius: 175,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  stationLabel: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3742fa',
    textAlign: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#3742fa',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  callout: {
    padding: 10,
    minWidth: 200,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  calloutContent: {
    marginTop: 5,
  },
  calloutText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  calloutLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)', // 100% opaque white
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  legendLine: {
    width: 30,
    height: 3,
    marginRight: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -15,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#ff0000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  selectedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendNote: {
    marginTop: 10,
    alignItems: 'center',
  },
  legendNoteText: {
    fontSize: 10,
    color: '#555',
    fontStyle: 'italic',
  },
  controls: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  controlsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  controlsSubtitle: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
  },
});

export default SimpleMap; 