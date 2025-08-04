import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TimetableManagementScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [selectedDay, setSelectedDay] = useState('Weekday');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
  // Initialize dynamic styles using the current theme
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  // Mock data for timetables
  const [timetables, setTimetables] = useState({
    'Weekday': [
      { 
        id: '1', 
        trainId: 'Express 101', 
        routeFrom: 'Central Station',
        routeTo: 'North Terminal',
        stops: [
          { station: 'Central Station', arrivalTime: '--:--', departureTime: '10:00 AM' },
          { station: 'East Hub', arrivalTime: '10:15 AM', departureTime: '10:18 AM' },
          { station: 'North Terminal', arrivalTime: '10:30 AM', departureTime: '--:--' },
        ]
      },
      { 
        id: '2', 
        trainId: 'Local 205', 
        routeFrom: 'East Hub',
        routeTo: 'West Junction',
        stops: [
          { station: 'East Hub', arrivalTime: '--:--', departureTime: '10:15 AM' },
          { station: 'Central Station', arrivalTime: '10:25 AM', departureTime: '10:28 AM' },
          { station: 'West Junction', arrivalTime: '10:45 AM', departureTime: '--:--' },
        ]
      },
    ],
    'Weekend': [
      { 
        id: '3', 
        trainId: 'Express 102', 
        routeFrom: 'Central Station',
        routeTo: 'North Terminal',
        stops: [
          { station: 'Central Station', arrivalTime: '--:--', departureTime: '11:00 AM' },
          { station: 'East Hub', arrivalTime: '11:15 AM', departureTime: '11:18 AM' },
          { station: 'North Terminal', arrivalTime: '11:30 AM', departureTime: '--:--' },
        ]
      },
    ],
    'Holiday': [
      { 
        id: '4', 
        trainId: 'Special 303', 
        routeFrom: 'Central Station',
        routeTo: 'North Terminal',
        stops: [
          { station: 'Central Station', arrivalTime: '--:--', departureTime: '12:00 PM' },
          { station: 'East Hub', arrivalTime: '12:15 PM', departureTime: '12:18 PM' },
          { station: 'North Terminal', arrivalTime: '12:30 PM', departureTime: '--:--' },
        ]
      },
    ]
  });

  // Function to handle editing a timetable entry
  const handleEditTimetable = (id) => {
    Alert.alert('Edit Timetable', `Edit timetable entry ${id}`);
    // In a real app, this would open a modal or navigate to an edit screen
  };

  // Function to handle deleting a timetable entry
  const handleDeleteTimetable = (id) => {
    Alert.alert(
      'Delete Timetable',
      'Are you sure you want to delete this timetable entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            // Filter out the deleted timetable
            const updatedTimetables = {
              ...timetables,
              [selectedDay]: timetables[selectedDay].filter(item => item.id !== id)
            };
            setTimetables(updatedTimetables);
            Alert.alert('Success', 'Timetable entry deleted successfully');
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Function to handle adding a new timetable entry
  const handleAddTimetable = () => {
    // Here you would typically add the new timetable entry to your data
    setIsAddModalVisible(false);
    Alert.alert('Success', 'New timetable entry added successfully');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timetable Management</Text>
        <Text style={styles.headerSubtitle}>Manage train schedules and routes</Text>
      </View>
      
      {/* Day Selection Tabs */}
      <View style={styles.daySelector}>
        <TouchableOpacity 
          style={[styles.dayTab, selectedDay === 'Weekday' && styles.selectedDayTab]}
          onPress={() => setSelectedDay('Weekday')}
        >
          <Text style={[styles.dayText, selectedDay === 'Weekday' && styles.selectedDayText]}>
            Weekday
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.dayTab, selectedDay === 'Weekend' && styles.selectedDayTab]}
          onPress={() => setSelectedDay('Weekend')}
        >
          <Text style={[styles.dayText, selectedDay === 'Weekend' && styles.selectedDayText]}>
            Weekend
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.dayTab, selectedDay === 'Holiday' && styles.selectedDayTab]}
          onPress={() => setSelectedDay('Holiday')}
        >
          <Text style={[styles.dayText, selectedDay === 'Holiday' && styles.selectedDayText]}>
            Holiday
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Timetable</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#3498db" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {/* Timetables List */}
      <View style={styles.timetablesContainer}>
        {timetables[selectedDay].length > 0 ? (
          timetables[selectedDay].map((timetable) => (
            <View key={timetable.id} style={styles.timetableCard}>
              <View style={styles.timetableHeader}>
                <View>
                  <Text style={styles.trainId}>{timetable.trainId}</Text>
                  <Text style={styles.routeText}>
                    <Text>{timetable.routeFrom}</Text>
                    <Text> → </Text>
                    <Text>{timetable.routeTo}</Text>
                  </Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditTimetable(timetable.id)}
                  >
                    <Ionicons name="create-outline" size={20} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTimetable(timetable.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.timetableContent}>
                <View style={styles.stopsHeader}>
                  <Text style={styles.stationColumnHeader}>Station</Text>
                  <Text style={styles.timeColumnHeader}>Arrival</Text>
                  <Text style={styles.timeColumnHeader}>Departure</Text>
                </View>
                
                {timetable.stops.map((stop, index) => (
                  <View key={index} style={styles.stopRow}>
                    <Text style={styles.stationName}>{stop.station}</Text>
                    <Text style={styles.timeValue}>{stop.arrivalTime}</Text>
                    <Text style={styles.timeValue}>{stop.departureTime}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>
              No timetables for {selectedDay}
            </Text>
          </View>
        )}
      </View>
      
      {/* Add Timetable Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Timetable</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Train ID"
              placeholderTextColor="#999"
            />
            
            <View style={styles.routeInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="From Station"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="To Station"
                placeholderTextColor="#999"
              />
            </View>
            
            <Text style={styles.sectionTitle}>Stops</Text>
            {/* This would typically be a dynamic list of stops with add/remove functionality */}
            <View style={styles.stopInputRow}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 8 }]}
                placeholder="Station Name"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="Arrival"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Departure"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTimetable}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Create dynamic styles that use theme colors
const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: isDarkMode ? colors.cardDark : '#2c3e50',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLightSecondary,
    marginTop: 5,
  },
  daySelector: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? colors.cardDark : '#fff',
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.2 : 0.1,
    shadowRadius: 2,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedDayTab: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontWeight: 'bold',
    color: isDarkMode ? colors.textLightSecondary : '#7f8c8d',
  },
  selectedDayText: {
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.primary,
    marginLeft: 5,
  },
  timetablesContainer: {
    margin: 15,
  },
  timetableCard: {
    backgroundColor: isDarkMode ? colors.cardDark : '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.2 : 0.1,
    shadowRadius: 2,
  },
  timetableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? colors.borderDark : '#ecf0f1',
  },
  trainId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? colors.textLight : '#2c3e50',
  },
  routeText: {
    color: isDarkMode ? colors.textLightSecondary : '#7f8c8d',
    marginTop: 3,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  timetableContent: {
    padding: 15,
  },
  stopsHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? colors.borderDark : '#ecf0f1',
  },
  stationColumnHeader: {
    flex: 2,
    fontWeight: 'bold',
    color: isDarkMode ? colors.textLightSecondary : '#7f8c8d',
  },
  timeColumnHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: isDarkMode ? colors.textLightSecondary : '#7f8c8d',
    textAlign: 'center',
  },
  stopRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? colors.borderDark : '#ecf0f1',
  },
  stationName: {
    flex: 2,
    color: isDarkMode ? colors.textLight : '#2c3e50',
  },
  timeValue: {
    flex: 1,
    textAlign: 'center',
    color: isDarkMode ? colors.textLight : '#2c3e50',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: isDarkMode ? colors.cardDark : '#fff',
    borderRadius: 10,
  },
  emptyStateText: {
    marginTop: 15,
    color: isDarkMode ? colors.textLightSecondary : '#7f8c8d',
    fontSize: 16,
  },
});

export default TimetableManagementScreen;
