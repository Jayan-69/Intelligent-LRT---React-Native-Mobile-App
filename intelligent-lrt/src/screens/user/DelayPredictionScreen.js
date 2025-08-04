import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fetchDelayPredictions, selectCurrentPrediction, selectIsLoadingPrediction, getDelayRiskLevel } from '../../redux/slices/predictionSlice';
import axios from 'axios';
import { getServerBaseUrl } from '../../config/apiConfig';
import { useTheme } from '../../context/ThemeContext';

const DelayPredictionScreen = ({ route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const currentPrediction = useSelector(selectCurrentPrediction);
  const isLoadingPrediction = useSelector(selectIsLoadingPrediction);

  const [trainNotices, setTrainNotices] = useState([]);
  const [quickMessages, setQuickMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState({});

  const trainId = route.params?.trainId;
  const routeId = route.params?.routeId;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (trainId && routeId) {
        dispatch(fetchDelayPredictions({ trainId, routeId }));
      }
      const baseUrl = await getServerBaseUrl();
      const [noticesRes, messagesRes] = await Promise.all([
        axios.get(`${baseUrl}/api/notices/trains`),
        axios.get(`${baseUrl}/api/notices/quickmsgs`)
      ]);

      const sortedNotices = noticesRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
      setTrainNotices(sortedNotices);

      const activeMessages = messagesRes.data.filter(msg => new Date(msg.expiresAt) > new Date());
      setQuickMessages(activeMessages);
      const initialVisibility = activeMessages.reduce((acc, msg) => ({ ...acc, [msg._id]: true }), {});
      setVisibleMessages(initialVisibility);

    } catch (_error) {
      Alert.alert('Error', 'Failed to fetch latest updates. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, trainId, routeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dismissMessage = (id) => {
    setVisibleMessages(prev => ({ ...prev, [id]: false }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delayed': return { color: colors.warning, fontWeight: 'bold' };
      case 'Cancelled': return { color: colors.error, fontWeight: 'bold' };
      default: return { color: colors.success, fontWeight: 'bold' };
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 16 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    refreshButton: { padding: 8 },
    sectionCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    sectionHeader: { fontSize: 18, fontWeight: '600', color: colors.primary, marginBottom: 12 },
    quickMessageCard: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
    quickMessageText: { color: '#FFFFFF', flex: 1, marginLeft: 12, fontSize: 15 },
    dismissButton: { marginLeft: 'auto', padding: 8 },
    noticeTable: { marginTop: 8 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.primary, paddingBottom: 8, marginBottom: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 12, alignItems: 'center' },
    headerCell: { flex: 1.2, fontWeight: 'bold', color: colors.text, textAlign: 'left', fontSize: 14 },
    statusHeaderCell: { flex: 1, fontWeight: 'bold', color: colors.text, textAlign: 'center', fontSize: 14 },
    timeHeaderCell: { flex: 1.5, fontWeight: 'bold', color: colors.text, textAlign: 'right', fontSize: 14 },
    cell: { flex: 1.2, color: colors.text, textAlign: 'left' },
    statusCell: { flex: 1, textAlign: 'center' },
    timeCell: { flex: 1.5, color: colors.text, textAlign: 'right', fontSize: 12 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { textAlign: 'center', color: colors.text, marginTop: 20, fontSize: 16, fontStyle: 'italic' },
    predictionCard: { marginBottom: 16, borderRadius: 12 },
    predictionLabel: { fontSize: 16, color: colors.text },
    delayValue: { fontSize: 28, fontWeight: 'bold' },
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} colors={[colors.primary]} tintColor={colors.primary} />}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Live Updates</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchData} disabled={isLoading}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {quickMessages.filter(msg => visibleMessages[msg._id]).map(msg => (
        <View key={msg._id} style={styles.quickMessageCard}>
          <Ionicons name="megaphone-outline" size={24} color="#FFFFFF" />
          <Text style={styles.quickMessageText}>{msg.content}</Text>
          <TouchableOpacity onPress={() => dismissMessage(msg._id)} style={styles.dismissButton}>
            <Ionicons name="close-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ))}

      {trainId && routeId && (
        <Card style={styles.sectionCard}>
          <Card.Title title="Delay Prediction" titleStyle={{color: colors.primary}} />
          <Card.Content>
            {isLoadingPrediction ? (
              <ActivityIndicator color={colors.primary} />
            ) : currentPrediction ? (
              <View>
                <Text style={styles.predictionLabel}>Expected Delay: 
                  <Text style={[styles.delayValue, { color: getDelayRiskLevel(currentPrediction.predictedDelay).color }]}>
                    {` ${currentPrediction.predictedDelay} min`}
                  </Text>
                </Text>
              </View>
            ) : (
              <Text style={styles.emptyText}>No prediction data available.</Text>
            )}
          </Card.Content>
        </Card>
      )}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Recent Train Notices</Text>
        <View style={styles.noticeTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Train</Text>
            <Text style={styles.statusHeaderCell}>Status</Text>
            <Text style={styles.timeHeaderCell}>Last Updated</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.primary} />
          ) : trainNotices.length > 0 ? (
            trainNotices.map((notice) => (
              <View key={notice._id} style={styles.tableRow}>
                <Text style={styles.cell}>{`${notice.trainName} (${notice.trainType})`}</Text>
                <Text style={[styles.statusCell, getStatusStyle(notice.status)]}>{notice.status}</Text>
                <Text style={styles.timeCell}>{formatDate(notice.createdAt)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent train notices.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default DelayPredictionScreen;
