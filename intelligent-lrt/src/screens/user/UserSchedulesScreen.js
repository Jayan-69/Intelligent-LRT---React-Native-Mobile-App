import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getServerBaseUrl } from '../../config/apiConfig';

const UserSchedulesScreen = () => {
  const { colors } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'express', 'slow', 'intercity'
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'all', 'morning', 'evening', 'non-office'

  const trainTypes = [
    { label: 'All Types', value: 'all' },
    { label: 'Express', value: 'E' },
    { label: 'Slow', value: 'S' },
    { label: 'Intercity', value: 'I' },
    { label: 'Semi Express', value: 'SE' }
  ];

  const periods = [
    { label: 'All Periods', value: 'all' },
    { label: 'Morning Office Hours', value: 'Morning Office Hours' },
    { label: 'Evening Office Hours', value: 'Evening Office Hours' },
    { label: 'Non-Office Hours', value: 'Non-Office Hours' }
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
      setFilteredSchedules(data);
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

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchQuery, selectedFilter, selectedPeriod]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedules();
  };

  const filterSchedules = () => {
    let filtered = [...schedules];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(schedule => 
        schedule.trainCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.trainType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by train type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(schedule => schedule.trainType === selectedFilter);
    }

    // Filter by period
    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(schedule => schedule.period === selectedPeriod);
    }

    setFilteredSchedules(filtered);
  };

  const getTrainTypeLabel = (type) => {
    switch (type) {
      case 'E': return 'Express';
      case 'S': return 'Slow';
      case 'I': return 'Intercity';
      case 'SE': return 'Semi Express';
      default: return type;
    }
  };

  const getTrainTypeColor = (type) => {
    switch (type) {
      case 'E': return '#e74c3c';
      case 'S': return '#3498db';
      case 'I': return '#f39c12';
      case 'SE': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Time': return '#27ae60';
      case 'Delayed': return '#f39c12';
      case 'Cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Time': return 'checkmark-circle';
      case 'Delayed': return 'time';
      case 'Cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      const time = new Date(timeString);
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return timeString;
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={[styles.scheduleCard, { backgroundColor: colors.surface }]}>
      <View style={styles.scheduleHeader}>
        <View style={styles.trainInfo}>
          <View style={[styles.trainTypeBadge, { backgroundColor: getTrainTypeColor(item.trainType) }]}>
            <Text style={styles.trainTypeText}>{getTrainTypeLabel(item.trainType)}</Text>
          </View>
          <Text style={[styles.trainCode, { color: colors.text }]}>{item.trainCode}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status || 'Scheduled'}
          </Text>
        </View>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.stationContainer}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <View style={styles.stationDetails}>
            <Text style={[styles.stationLabel, { color: colors.placeholder }]}>From</Text>
            <Text style={[styles.stationName, { color: colors.text }]}>{item.from}</Text>
          </View>
        </View>
        
        <View style={styles.routeArrow}>
          <Ionicons name="arrow-forward" size={20} color={colors.placeholder} />
        </View>
        
        <View style={styles.stationContainer}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <View style={styles.stationDetails}>
            <Text style={[styles.stationLabel, { color: colors.placeholder }]}>To</Text>
            <Text style={[styles.stationName, { color: colors.text }]}>{item.to}</Text>
          </View>
        </View>
      </View>

      <View style={styles.scheduleDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color={colors.placeholder} />
          <Text style={[styles.detailText, { color: colors.text }]}>
            Departure: {formatTime(item.departureTime)}
          </Text>
        </View>
        
        {item.period && (
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color={colors.placeholder} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {item.period}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderFilterButton = (item, currentValue, onPress) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: currentValue === item.value ? colors.primary : colors.surface },
        { borderColor: colors.border }
      ]}
      onPress={() => onPress(item.value)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: currentValue === item.value ? '#fff' : colors.text }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading schedules...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Train Schedules</Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          View all available train schedules
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.placeholder} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by train code, station, or type..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.placeholder} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>Train Type:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {trainTypes.map((type) => 
            <View key={type.value}>
              {renderFilterButton(type, selectedFilter, setSelectedFilter)}
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>Time Period:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {periods.map((period) => 
            <View key={period.value}>
              {renderFilterButton(period, selectedPeriod, setSelectedPeriod)}
            </View>
          )}
        </ScrollView>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: '#fee' }]}>
          <Text style={[styles.errorText, { color: '#e74c3c' }]}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredSchedules}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item._id || item.trainCode}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="train" size={64} color={colors.placeholder} />
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>
              {searchQuery || selectedFilter !== 'all' || selectedPeriod !== 'all' 
                ? 'No schedules match your filters'
                : 'No schedules available'
              }
            </Text>
            {(searchQuery || selectedFilter !== 'all' || selectedPeriod !== 'all') && (
              <TouchableOpacity
                style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedPeriod('all');
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
    paddingTop: 0,
  },
  scheduleCard: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
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
    marginBottom: 15,
  },
  trainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  trainTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  trainCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationDetails: {
    marginLeft: 8,
    flex: 1,
  },
  stationLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeArrow: {
    marginHorizontal: 10,
  },
  scheduleDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserSchedulesScreen; 