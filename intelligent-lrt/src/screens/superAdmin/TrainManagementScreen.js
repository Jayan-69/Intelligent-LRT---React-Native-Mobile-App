import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getServerBaseUrl } from '../../config/apiConfig';

const TrainManagementScreen = () => {
  const { colors } = useTheme();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [newTrain, setNewTrain] = useState({ trainName: '', trainNumber: '', capacity: '' });

  const fetchTrains = useCallback(async () => {
    try {
      setError(null);
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/trains`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTrains(data);
    } catch (error) {
      console.error('Error fetching trains:', error);
      setError('Failed to fetch trains. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  const onRefresh = () => {
    setRefreshing(true);
    setError(null);
    fetchTrains();
  };

  const handleAddTrain = async () => {
    if (!newTrain.trainName || !newTrain.trainNumber || !newTrain.capacity) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setError(null);
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/trains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTrain,
          capacity: parseInt(newTrain.capacity),
          status: 'On Time'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert('Success', 'Train added successfully!');
      setModalVisible(false);
      setNewTrain({ trainName: '', trainNumber: '', capacity: '' });
      fetchTrains();
    } catch (error) {
      console.error('Error adding train:', error);
      setError('Failed to add train. Please try again.');
    }
  };

  const renderTrain = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.trainInfo}>
        <Text style={[styles.trainName, { color: colors.text }]}>{item.trainName} ({item.trainNumber})</Text>
        <Text style={[styles.detailText, { color: colors.placeholder }]}>Capacity: {item.capacity}</Text>
        <Text style={[styles.detailText, { color: colors.placeholder }]}>Status: {item.status}</Text>
        <Text style={[styles.detailText, { color: colors.placeholder }]}>
          Last Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={trains}
        renderItem={renderTrain}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{color: colors.text}}>No trains found.</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Train</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Train Name"
              placeholderTextColor={colors.placeholder}
              value={newTrain.trainName}
              onChangeText={(text) => setNewTrain({ ...newTrain, trainName: text })}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Train Number"
              placeholderTextColor={colors.placeholder}
              value={newTrain.trainNumber}
              onChangeText={(text) => setNewTrain({ ...newTrain, trainNumber: text })}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Capacity"
              placeholderTextColor={colors.placeholder}
              value={newTrain.capacity}
              onChangeText={(text) => setNewTrain({ ...newTrain, capacity: text })}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleAddTrain}>
                <Text style={styles.buttonText}>Add Train</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.border }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
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
    padding: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 3,
  },
  trainInfo: {
    flex: 1,
  },
  trainName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TrainManagementScreen;
