import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getServerBaseUrl } from '../../config/apiConfig';
import { getStationsWithCoordinates, updateStationLocation } from '../../services/trainLocationService';

const StationManagementScreen = () => {
  const { colors } = useTheme();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [error, setError] = useState(null);

  // Form state
  const [stationName, setStationName] = useState('');
  const [stationCode, setStationCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');

  const fetchStations = useCallback(async () => {
    try {
      setError(null);
      const stationsData = await getStationsWithCoordinates();
      setStations(stationsData);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setError('Failed to fetch stations. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStations();
  };

  const resetForm = () => {
    setStationName('');
    setStationCode('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setEditingStation(null);
  };

  const openEditModal = (station) => {
    setEditingStation(station);
    setStationName(station.name || '');
    setStationCode(station.code || station.id || '');
    setLatitude(station.coordinates?.latitude?.toString() || '');
    setLongitude(station.coordinates?.longitude?.toString() || '');
    setDescription(station.description || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!stationName || !stationCode) {
      Alert.alert('Error', 'Please fill in station name and code');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Please enter valid coordinates');
      return;
    }

    try {
      // Update station location using the existing service
      await updateStationLocation(stationCode, lat, lng);
      
      // Refresh stations data
      await fetchStations();
      
      Alert.alert('Success', 'Station updated successfully!');
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Error updating station:', error);
      Alert.alert('Error', error.message || 'Failed to update station');
    }
  };

  const handleDelete = async (stationId) => {
    Alert.alert(
      'Delete Station',
      'Are you sure you want to delete this station? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const baseUrl = await getServerBaseUrl();
              const response = await fetch(`${baseUrl}/api/stations/${stationId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              await fetchStations();
              Alert.alert('Success', 'Station deleted successfully!');
            } catch (error) {
              console.error('Error deleting station:', error);
              Alert.alert('Error', 'Failed to delete station');
            }
          },
        },
      ]
    );
  };

  const getStationIcon = (type) => {
    switch (type) {
      case 'major': return 'business';
      case 'minor': return 'location';
      default: return 'business';
    }
  };

  const getStationColor = (type) => {
    switch (type) {
      case 'major': return '#e74c3c';
      case 'minor': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const renderStationItem = ({ item }) => (
    <View style={[styles.stationCard, { backgroundColor: colors.surface }]}>
      <View style={styles.stationHeader}>
        <View style={styles.stationInfo}>
          <Ionicons 
            name={getStationIcon(item.type)} 
            size={24} 
            color={getStationColor(item.type)} 
          />
          <View style={styles.stationDetails}>
            <Text style={[styles.stationName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.stationCode, { color: colors.placeholder }]}>
              Code: {item.code || item.id}
            </Text>
            <Text style={[styles.stationCoordinates, { color: colors.placeholder }]}>
              {item.coordinates?.latitude?.toFixed(4)}, {item.coordinates?.longitude?.toFixed(4)}
            </Text>
          </View>
        </View>
        <View style={styles.stationActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
            onPress={() => handleDelete(item.id || item.code)}
          >
            <Ionicons name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {item.description && (
        <Text style={[styles.stationDescription, { color: colors.placeholder }]}>
          {item.description}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading stations...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Station Management</Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Manage station information and locations
        </Text>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: '#fee' }]}>
          <Text style={[styles.errorText, { color: '#e74c3c' }]}>{error}</Text>
        </View>
      )}

      <FlatList
        data={stations}
        renderItem={renderStationItem}
        keyExtractor={(item) => item.id || item.code}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Edit Station Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingStation ? 'Edit Station' : 'Add Station'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Station Name *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={stationName}
                  onChangeText={setStationName}
                  placeholder="Enter station name"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Station Code *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={stationCode}
                  onChangeText={setStationCode}
                  placeholder="Enter station code"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.coordinatesContainer}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={[styles.label, { color: colors.text }]}>Latitude *</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border
                    }]}
                    value={latitude}
                    onChangeText={setLatitude}
                    placeholder="e.g., 6.9271"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.text }]}>Longitude *</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border
                    }]}
                    value={longitude}
                    onChangeText={setLongitude}
                    placeholder="e.g., 79.8612"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter station description"
                  placeholderTextColor={colors.placeholder}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
  },
  stationCard: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stationInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  stationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  stationCode: {
    fontSize: 14,
    marginBottom: 2,
  },
  stationCoordinates: {
    fontSize: 12,
  },
  stationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationDescription: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  coordinatesContainer: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StationManagementScreen; 