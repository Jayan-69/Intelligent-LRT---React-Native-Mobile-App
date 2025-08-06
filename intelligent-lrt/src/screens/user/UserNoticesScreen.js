import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getServerBaseUrl } from '../../config/apiConfig';


const UserNoticesScreen = () => {
  const { colors } = useTheme();
  const [notices, setNotices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notices'); // 'notices' or 'schedules'
  const [filterType, setFilterType] = useState('all'); // 'all', 'delays', 'emergencies'

  const fetchNotices = useCallback(async () => {
    try {
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/notices`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to fetch notices');
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    try {
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/schedules`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Failed to fetch schedules');
    }
  }, []);

  const fetchData = useCallback(async () => {
    setError(null);
    await Promise.all([fetchNotices(), fetchSchedules()]);
    setLoading(false);
    setRefreshing(false);
  }, [fetchNotices, fetchSchedules]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'Special':
        return 'megaphone';
      case 'Delay':
        return 'time';
      case 'Cancellation':
        return 'close-circle';
      case 'Maintenance':
        return 'construct';
      case 'Emergency':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getNoticeColor = (type) => {
    switch (type) {
      case 'Special':
        return '#2196F3';
      case 'Delay':
        return '#FF9800';
      case 'Cancellation':
        return '#F44336';
      case 'Maintenance':
        return '#9C27B0';
      case 'Emergency':
        return '#FF5722';
      default:
        return '#757575';
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Time':
        return 'checkmark-circle';
      case 'Delayed':
        return 'time';
      case 'Cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const filteredNotices = notices.filter(notice => {
    if (filterType === 'all') return true;
    if (filterType === 'delays') return notice.type === 'Delay';
    if (filterType === 'emergencies') return notice.type === 'Emergency';
    return true;
  });

  const renderNoticeItem = ({ item }) => (
    <View style={[styles.noticeItem, { backgroundColor: colors.surface }]}>
      <View style={styles.noticeHeader}>
        <View style={styles.noticeIconContainer}>
          <Ionicons 
            name={getNoticeIcon(item.type)} 
            size={24} 
            color={getNoticeColor(item.type)} 
          />
        </View>
        <View style={styles.noticeContent}>
          <Text style={[styles.noticeTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.noticeText, { color: colors.text }]}>
            {item.content}
          </Text>
          <View style={styles.noticeMeta}>
            <View style={[styles.noticeTypeBadge, { backgroundColor: getNoticeColor(item.type) + '20' }]}>
              <Text style={[styles.noticeTypeText, { color: getNoticeColor(item.type) }]}>
                {item.type}
              </Text>
            </View>
            <Text style={[styles.noticeDate, { color: colors.placeholder }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderScheduleItem = ({ item }) => (
    <View style={[styles.scheduleItem, { backgroundColor: colors.surface }]}>
      <View style={styles.scheduleHeader}>
        <View style={styles.trainInfo}>
          <Text style={[styles.trainCode, { color: colors.primary }]}>
            {item.trainCode}
          </Text>
          <Text style={[styles.trainType, { color: colors.text }]}>
            {getTrainTypeLabel(item.trainType)}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={20} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.scheduleDetails}>
        <View style={styles.routeInfo}>
          <Text style={[styles.routeText, { color: colors.text }]}>
            <Text style={styles.label}>From:</Text> {item.from}
          </Text>
          <Text style={[styles.routeText, { color: colors.text }]}>
            <Text style={styles.label}>To:</Text> {item.to}
          </Text>
        </View>
        <View style={styles.timeInfo}>
          <Text style={[styles.timeText, { color: colors.text }]}>
            <Text style={styles.label}>Time:</Text> {item.departureTime}
          </Text>
          <Text style={[styles.periodText, { color: colors.placeholder }]}>
            {item.period}
          </Text>
        </View>
      </View>

      <Text style={[styles.updateDate, { color: colors.placeholder }]}>
        Last updated: {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading updates...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Notices & Updates
        </Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notices' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('notices')}
        >
          <Ionicons 
            name="notifications" 
            size={20} 
            color={activeTab === 'notices' ? 'white' : colors.text} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'notices' ? 'white' : colors.text }
          ]}>
            Notices ({notices.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'schedules' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('schedules')}
        >
          <Ionicons 
            name="train" 
            size={20} 
            color={activeTab === 'schedules' ? 'white' : colors.text} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'schedules' ? 'white' : colors.text }
          ]}>
            Schedules ({schedules.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'notices' && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'all' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[
                styles.filterText,
                { color: filterType === 'all' ? 'white' : colors.text }
              ]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'delays' && { backgroundColor: '#FF9800' }
              ]}
              onPress={() => setFilterType('delays')}
            >
              <Text style={[
                styles.filterText,
                { color: filterType === 'delays' ? 'white' : '#FF9800' }
              ]}>
                Delays
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'emergencies' && { backgroundColor: '#FF5722' }
              ]}
              onPress={() => setFilterType('emergencies')}
            >
              <Text style={[
                styles.filterText,
                { color: filterType === 'emergencies' ? 'white' : '#FF5722' }
              ]}>
                Emergencies
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {activeTab === 'notices' ? (
        <FlatList
          data={filteredNotices}
          renderItem={renderNoticeItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off" size={48} color={colors.placeholder} />
              <Text style={[styles.emptyText, { color: colors.placeholder }]}>
                No notices available
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
                Pull down to refresh
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="train-outline" size={48} color={colors.placeholder} />
              <Text style={[styles.emptyText, { color: colors.placeholder }]}>
                No schedules available
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
                Pull down to refresh
              </Text>
            </View>
          }
        />
      )}
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
  refreshButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
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
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  noticeItem: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noticeHeader: {
    flexDirection: 'row',
  },
  noticeIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  noticeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noticeTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noticeDate: {
    fontSize: 12,
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
  trainInfo: {
    flex: 1,
  },
  trainCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trainType: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scheduleDetails: {
    marginBottom: 12,
  },
  routeInfo: {
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  periodText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  label: {
    fontWeight: 'bold',
  },
  updateDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default UserNoticesScreen; 