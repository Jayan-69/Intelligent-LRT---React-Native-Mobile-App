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
import { Picker } from '@react-native-picker/picker';
import { getServerBaseUrl } from '../../config/apiConfig';

const TrainScheduleManagementScreen = () => {
  const { colors } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Track which schedule is being updated

  // Form state
  const [trainCode, setTrainCode] = useState(() => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `T${timestamp}${random}`;
  });
  const [trainType, setTrainType] = useState('E');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [period, setPeriod] = useState('Morning Office Hours');
  const [status, setStatus] = useState('On Time');

  const trainTypes = [
    { label: 'Express', value: 'E' },
    { label: 'Slow', value: 'S' },
    { label: 'Intercity', value: 'I' },
    { label: 'Semi Express', value: 'SE' }
  ];

  const periods = [
    'Morning Office Hours',
    'Evening Office Hours',
    'Non-Office Hours'
  ];

  const statuses = [
    'On Time',
    'Delayed',
    'Cancelled'
  ];

  const stations = [
    'Ragama', 'Pahala Karagahamuna', 'Kadawatha', 'Mahara', 'Kiribathgoda',
    'Tyre Junction', 'Pattiya Junction', 'Paliyagoda', 'Ingurukade Junction',
    'Armour Street Junction', 'Maradana', 'Pettah', 'Slave Island',
    'Gangaramaya', 'Kollupitiya', 'Bambalapitiya', 'Bauddhaloka Mawatha',
    'Thimbirigasyaya', 'Havelock Town', 'Kirulapona'
  ];

  const fetchSchedules = useCallback(async () => {
    try {
      setError(null);
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/routes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Failed to fetch train schedules. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedules();
  };

  const generateUniqueTrainCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `T${timestamp}${random}`;
  };

  const resetForm = () => {
    setTrainCode(generateUniqueTrainCode()); // Auto-generate unique train code
    setTrainType('E');
    setFromStation('');
    setToStation('');
    setDepartureTime('');
    setPeriod('Morning Office Hours');
    setStatus('On Time');
    setEditingSchedule(null);
  };

  const openEditModal = (schedule) => {
    console.log('Opening edit modal for schedule:', schedule);
    setEditingSchedule(schedule);
    setTrainCode(schedule.trainCode);
    setTrainType(schedule.trainType);
    setFromStation(schedule.from);
    setToStation(schedule.to);
    setDepartureTime(schedule.departureTime);
    setPeriod(schedule.period || 'Morning Office Hours');
    setStatus(schedule.status || 'On Time');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!trainCode || !fromStation || !toStation || !departureTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const baseUrl = await getServerBaseUrl();
      const scheduleData = {
        trainCode,
        trainType,
        from: fromStation,
        to: toStation,
        departureTime,
        period,
        status,
        stops: [fromStation, toStation] // Simplified stops for now
      };

      console.log(`${editingSchedule ? 'Updating' : 'Creating'} schedule:`, scheduleData);

      let response;
      if (editingSchedule) {
        // Update existing schedule
        console.log(`Updating schedule with ID: ${editingSchedule._id}`);
        response = await fetch(`${baseUrl}/api/routes/${editingSchedule._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scheduleData),
        });
      } else {
        // Create new schedule
        console.log('Creating new schedule');
        response = await fetch(`${baseUrl}/api/routes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scheduleData),
        });
      }

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to save schedule. Please try again.';
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse the error, use the raw text
          errorMessage = errorText || errorMessage;
        }
        
        // Provide specific guidance for common errors
        if (errorMessage.includes('already exists')) {
          errorMessage += '\n\nPlease choose a different train code or edit the existing schedule with that code.';
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Schedule saved successfully:', result);

      Alert.alert(
        'Success',
        editingSchedule ? 'Schedule updated successfully!' : 'Schedule created successfully!'
      );

      setModalVisible(false);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      Alert.alert('Error', error.message || 'Failed to save schedule. Please try again.');
    }
  };

  const handleDelete = async (scheduleId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const baseUrl = await getServerBaseUrl();
              const response = await fetch(`${baseUrl}/api/routes/${scheduleId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              Alert.alert('Success', 'Schedule deleted successfully!');
              fetchSchedules();
            } catch (error) {
              console.error('Error deleting schedule:', error);
              Alert.alert('Error', 'Failed to delete schedule. Please try again.');
            }
          },
        },
      ]
    );
  };

  const updateTrainStatus = async (scheduleId, newStatus) => {
    // Prevent multiple rapid clicks
    if (updatingStatus === scheduleId) {
      return;
    }
    
    try {
      setUpdatingStatus(scheduleId);
      console.log(`Updating status for schedule ${scheduleId} to ${newStatus}`);
      
      // Optimistically update the local state for immediate UI feedback
      setSchedules(prevSchedules => 
        prevSchedules.map(schedule => 
          schedule._id === scheduleId 
            ? { ...schedule, status: newStatus }
            : schedule
        )
      );
      
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/routes/${scheduleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log(`Status update response: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Status update error response:', errorText);
        
        let errorMessage = 'Failed to update train status. Please try again.';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        // Revert the optimistic update on error
        setSchedules(prevSchedules => 
          prevSchedules.map(schedule => 
            schedule._id === scheduleId 
              ? { ...schedule, status: schedule.status } // Keep original status
              : schedule
          )
        );
        
        throw new Error(errorMessage);
      }

      const updatedSchedule = await response.json();
      console.log('Status updated successfully:', updatedSchedule);

      Alert.alert('Success', `Train status updated to ${newStatus}!`);
      
      // Refresh the schedules list to ensure consistency
      await fetchSchedules();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', error.message || 'Failed to update train status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={[styles.scheduleItem, { backgroundColor: colors.surface }]}>
      <View style={styles.scheduleHeader}>
        <Text style={[styles.trainCode, { color: colors.primary }]}>
          {item.trainCode}
        </Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: getStatusColor(item.status) },
              updatingStatus === item._id && styles.statusButtonUpdating
            ]}
            onPress={() => {
              if (updatingStatus === item._id) return; // Prevent clicks while updating
              const currentIndex = statuses.indexOf(item.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              updateTrainStatus(item._id, nextStatus);
            }}
            disabled={updatingStatus === item._id}
          >
            {updatingStatus === item._id ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.statusText}>{item.status}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scheduleDetails}>
        <Text style={[styles.detailText, { color: colors.text }]}>
          <Text style={styles.label}>Type:</Text> {getTrainTypeLabel(item.trainType)}
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          <Text style={styles.label}>Route:</Text> {item.from} → {item.to}
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          <Text style={styles.label}>Time:</Text> {item.departureTime}
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          <Text style={styles.label}>Period:</Text> {item.period}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={16} color="white" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash" size={16} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getTrainTypeLabel = (type) => {
    const typeMap = {
      'E': 'Express',
      'S': 'Slow',
      'I': 'Intercity',
      'SE': 'Semi Express'
    };
    return typeMap[type] || type;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'On Time': '#4CAF50',
      'Delayed': '#FF9800',
      'Cancelled': '#F44336'
    };
    return colorMap[status] || '#757575';
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading schedules...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Train Schedule Management
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={schedules}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="train" size={48} color={colors.placeholder} />
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>
              No schedules found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
              Pull down to refresh or tap the + button to add a schedule
            </Text>
          </View>
        }
      />

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
                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Train Code * {editingSchedule && <Text style={{ color: colors.primary, fontSize: 12 }}>(Editing: {editingSchedule.trainCode})</Text>}
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: editingSchedule ? colors.primary : colors.border,
                  borderWidth: editingSchedule ? 2 : 1
                }]}
                value={trainCode}
                onChangeText={setTrainCode}
                placeholder="e.g., E1, S1, I1"
                placeholderTextColor={colors.placeholder}
                editable={true}
              />
              {editingSchedule && (
                <Text style={[styles.helpText, { color: colors.placeholder }]}>
                  ⚠️ Changing the train code will update this schedule. Make sure the new code is unique.
                </Text>
              )}

              <Text style={[styles.inputLabel, { color: colors.text }]}>Train Type *</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}>
                <Picker
                  selectedValue={trainType}
                  onValueChange={setTrainType}
                  style={[styles.picker, { color: colors.text }]}
                >
                  {trainTypes.map((type) => (
                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.inputLabel, { color: colors.text }]}>From Station *</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}>
                <Picker
                  selectedValue={fromStation}
                  onValueChange={setFromStation}
                  style={[styles.picker, { color: colors.text }]}
                >
                  <Picker.Item label="Select From Station" value="" />
                  {stations.map((station) => (
                    <Picker.Item key={station} label={station} value={station} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.inputLabel, { color: colors.text }]}>To Station *</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}>
                <Picker
                  selectedValue={toStation}
                  onValueChange={setToStation}
                  style={[styles.picker, { color: colors.text }]}
                >
                  <Picker.Item label="Select To Station" value="" />
                  {stations.map((station) => (
                    <Picker.Item key={station} label={station} value={station} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.inputLabel, { color: colors.text }]}>Departure Time *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={departureTime}
                onChangeText={setDepartureTime}
                placeholder="e.g., 07:30 AM"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={[styles.inputLabel, { color: colors.text }]}>Period</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}>
                <Picker
                  selectedValue={period}
                  onValueChange={setPeriod}
                  style={[styles.picker, { color: colors.text }]}
                >
                  {periods.map((p) => (
                    <Picker.Item key={p} label={p} value={p} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.inputLabel, { color: colors.text }]}>Status</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}>
                <Picker
                  selectedValue={status}
                  onValueChange={setStatus}
                  style={[styles.picker, { color: colors.text }]}
                >
                  {statuses.map((s) => (
                    <Picker.Item key={s} label={s} value={s} />
                  ))}
                </Picker>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#757575' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>
                  {editingSchedule ? 'Update' : 'Save'}
                </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  scheduleItem: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainCode: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusButtonUpdating: {
    opacity: 0.7,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scheduleDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  helpText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'left',
  },
});

export default TrainScheduleManagementScreen; 