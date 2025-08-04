import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { selectTrains, fetchTrains, updateTrainStatus } from '../../redux/slices/trainSlice';
import axios from 'axios';
import { getServerBaseUrl } from '../../config/apiConfig';
import { useTheme } from '../../context/ThemeContext';

/**
 * Notices Screen - For SuperAdmins to manage train status and send quick messages.
 */
const PredictionScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const trains = useSelector(selectTrains);
  const dispatch = useDispatch();

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [trainStatus, setTrainStatus] = useState('On Time');
  const [trainNotices, setTrainNotices] = useState([]);
  const [quickMessage, setQuickMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingNotice, setIsSubmittingNotice] = useState(false);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);

  useEffect(() => {
    dispatch(fetchTrains());
    fetchTrainNotices();
  }, [dispatch]);

  const fetchTrainNotices = async () => {
    setIsLoading(true);
    try {
      const baseUrl = await getServerBaseUrl();
      const response = await axios.get(`${baseUrl}/api/notices/trains`);
      const sortedNotices = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTrainNotices(sortedNotices);
    } catch (_err) {
      Alert.alert('Error', 'Failed to fetch train notices. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTrainNotice = async () => {
    if (!selectedTrain) {
      Alert.alert('Selection Required', 'Please select a train.');
      return;
    }
    setIsSubmittingNotice(true);
    try {
      const baseUrl = await getServerBaseUrl();
      const trainObj = trains.find(train => train.id === selectedTrain);
      if (!trainObj) {
        Alert.alert('Error', 'Selected train not found.');
        return;
      }
      const noticeData = {
        trainId: trainObj.id,
        trainName: trainObj.name,
        trainType: trainObj.type,
        departureTime: trainObj.departureTime || new Date().toISOString(),
        status: trainStatus,
        createdAt: new Date().toISOString(),
      };
      await axios.post(`${baseUrl}/api/notices/trains`, noticeData);
      dispatch(updateTrainStatus({ trainId: trainObj.id, status: trainStatus }));
      await fetchTrainNotices();
      Alert.alert('Success', 'Train notice has been published successfully.');
    } catch (_error) {
      Alert.alert('Submission Error', 'Failed to submit train notice.');
    } finally {
      setIsSubmittingNotice(false);
    }
  };

  const handleSubmitQuickMessage = async () => {
    if (!quickMessage.trim()) {
      Alert.alert('Input Required', 'Please enter a message to send.');
      return;
    }
    setIsSubmittingMessage(true);
    try {
      const baseUrl = await getServerBaseUrl();
      const messageData = {
        content: quickMessage,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await axios.post(`${baseUrl}/api/notices/quickmsgs`, messageData);
      setQuickMessage('');
      Alert.alert('Success', 'Quick message has been sent to all users.');
    } catch (_error) {
      Alert.alert('Submission Error', 'Failed to send quick message.');
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'On Time': return { color: '#2ecc71', fontWeight: 'bold' };
      case 'Delayed': return { color: '#f39c12', fontWeight: 'bold' };
      case 'Cancelled': return { color: '#e74c3c', fontWeight: 'bold' };
      default: return { color: colors.text };
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 16 },
    headerText: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16, textAlign: 'center' },
    sectionCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    sectionHeader: { fontSize: 18, fontWeight: '600', color: colors.primary, marginBottom: 12 },
    pickerContainer: { backgroundColor: isDarkMode ? '#333' : '#f0f0f0', borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
    picker: { height: 50, color: colors.text },
    button: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginVertical: 8 },
    buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
    textInput: { backgroundColor: isDarkMode ? '#333' : '#f0f0f0', color: colors.text, padding: 12, borderRadius: 8, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border },
    noticeTable: { marginTop: 8 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.primary, paddingBottom: 8, marginBottom: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 12, alignItems: 'center' },
    headerCell: { flex: 1.2, fontWeight: 'bold', color: colors.text, textAlign: 'left', fontSize: 14 },
    statusHeaderCell: { flex: 1, fontWeight: 'bold', color: colors.text, textAlign: 'center', fontSize: 14 },
    timeHeaderCell: { flex: 1.5, fontWeight: 'bold', color: colors.text, textAlign: 'right', fontSize: 14 },
    cell: { flex: 1.2, color: colors.text, textAlign: 'left' },
    statusCell: { flex: 1, textAlign: 'center' },
    timeCell: { flex: 1.5, color: colors.text, textAlign: 'right', fontSize: 12 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    emptyText: { textAlign: 'center', color: colors.text, marginTop: 20, fontSize: 16, fontStyle: 'italic' },
  });

  if (trains.length === 0 && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading Train Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.headerText}>Notices Dashboard</Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Update Train Status</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedTrain} onValueChange={setSelectedTrain} style={styles.picker} prompt="Select a Train">
            <Picker.Item label="Select a Train..." value={null} />
            {trains.map(train => (
              <Picker.Item key={train.id} label={`${train.name} (${train.type})`} value={train.id} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={trainStatus} onValueChange={setTrainStatus} style={styles.picker}>
            <Picker.Item label="On Time" value="On Time" />
            <Picker.Item label="Delayed" value="Delayed" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmitTrainNotice} disabled={isSubmittingNotice}>
          {isSubmittingNotice ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Publish Train Notice</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Send Quick Message to Users</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type a short announcement... (lasts 7 days)"
          placeholderTextColor="#888"
          value={quickMessage}
          onChangeText={setQuickMessage}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmitQuickMessage} disabled={isSubmittingMessage}>
          {isSubmittingMessage ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Send Quick Message</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Recent Train Notices</Text>
        <View style={styles.noticeTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Train</Text>
            <Text style={styles.statusHeaderCell}>Status</Text>
            <Text style={styles.timeHeaderCell}>Published At</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.primary} />
          ) : trainNotices.length > 0 ? (
            trainNotices.slice(0, 10).map((notice, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>{`${notice.trainName} (${notice.trainType})`}</Text>
                <Text style={[styles.statusCell, getStatusStyle(notice.status)]}>{notice.status}</Text>
                <Text style={styles.timeCell}>{formatDate(notice.createdAt)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent notices found.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default PredictionScreen;
