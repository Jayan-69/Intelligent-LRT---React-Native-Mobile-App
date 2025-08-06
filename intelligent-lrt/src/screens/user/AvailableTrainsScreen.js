import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getApiBaseUrl } from '../../config/apiConfig';

const AvailableTrainsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFilters, setShowFilters] = useState(false);

  // Sample stations data - will be replaced with database data
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchAvailableTrains();
    fetchStations();
  }, [fetchAvailableTrains, fetchStations]);

  const fetchStations = useCallback(async () => {
    try {
      const apiUrl = await getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/stations`);
      
      if (response.ok) {
        const data = await response.json();
        setStations(data.stations || []);
      } else {
        // Fallback to sample stations if API fails
        setStations([
          'Colombo Fort', 'Maradana', 'Dematagoda', 'Kelaniya', 'Wanawasala',
          'Horape', 'Ragama', 'Gampaha', 'Veyangoda', 'Mirigama', 'Polgahawela',
          'Rambukkana', 'Polgahawela', 'Peradeniya', 'Kandy', 'Nawalapitiya',
          'Hatton', 'Talawakele', 'Nanu Oya', 'Pattipola', 'Ohiya', 'Haputale',
          'Bandarawela', 'Ella', 'Demodara', 'Badulla'
        ]);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      // Fallback to sample stations
      setStations([
        'Colombo Fort', 'Maradana', 'Dematagoda', 'Kelaniya', 'Wanawasala',
        'Horape', 'Ragama', 'Gampaha', 'Veyangoda', 'Mirigama', 'Polgahawela',
        'Rambukkana', 'Polgahawela', 'Peradeniya', 'Kandy', 'Nawalapitiya',
        'Hatton', 'Talawakele', 'Nanu Oya', 'Pattipola', 'Ohiya', 'Haputale',
        'Bandarawela', 'Ella', 'Demodara', 'Badulla'
      ]);
    }
  }, []);

  const fetchAvailableTrains = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = await getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/available`);
      
      if (response.ok) {
        const data = await response.json();
        setTrains(data.trains || []);
      } else {
        // Fallback to sample data if API fails
        setTrains(getSampleTrains());
      }
    } catch (error) {
      console.error('Error fetching trains:', error);
      setTrains(getSampleTrains());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const getSampleTrains = () => [
    {
      id: '1',
      trainName: 'Intercity Express 1',
      trainNumber: 'I1',
      from: 'Colombo Fort',
      to: 'Kandy',
      departureTime: '08:30',
      arrivalTime: '11:45',
      status: 'On Time',
      availableSeats: 45,
      price: 250,
      type: 'Intercity'
    },
    {
      id: '2',
      trainName: 'Express Train 1',
      trainNumber: 'E1',
      from: 'Colombo Fort',
      to: 'Badulla',
      departureTime: '09:15',
      arrivalTime: '15:30',
      status: 'On Time',
      availableSeats: 32,
      price: 180,
      type: 'Express'
    },
    {
      id: '3',
      trainName: 'Slow Train 1',
      trainNumber: 'S1',
      from: 'Ragama',
      to: 'Polgahawela',
      departureTime: '10:00',
      arrivalTime: '11:30',
      status: 'Delayed',
      availableSeats: 120,
      price: 80,
      type: 'Slow'
    },
    {
      id: '4',
      trainName: 'Intercity Express 2',
      trainNumber: 'I2',
      from: 'Kandy',
      to: 'Colombo Fort',
      departureTime: '14:30',
      arrivalTime: '17:45',
      status: 'On Time',
      availableSeats: 28,
      price: 250,
      type: 'Intercity'
    }
  ];

  const onRefresh = () => {
    setRefreshing(true);
    fetchAvailableTrains();
  };

  const filteredTrains = trains.filter(train => {
    const matchesSearch = train.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         train.trainNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFrom = !selectedFrom || train.from === selectedFrom;
    const matchesTo = !selectedTo || train.to === selectedTo;
    return matchesSearch && matchesFrom && matchesTo;
  });

  const handleBookTicket = (train) => {
    navigation.navigate('BookTicket', { train, date: date });
  };

  const handleDateChange = (offset) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + offset);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Time': return '#4CAF50';
      case 'Delayed': return '#FF9800';
      case 'Cancelled': return '#F44336';
      default: return '#757575';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Intercity': return '#2196F3';
      case 'Express': return '#9C27B0';
      case 'Slow': return '#FF9800';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading available trains...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Available Trains</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Date Selector */}
      <View style={[styles.dateSelectorContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => handleDateChange(-1)} style={styles.dateArrow}>
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.dateText, { color: colors.text }]}>{new Date(date).toDateString()}</Text>
        <TouchableOpacity onPress={() => handleDateChange(1)} style={styles.dateArrow}>
          <Ionicons name="chevron-forward" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.placeholder} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search trains..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>From:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stationScroll}>
                {stations.map((station, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.stationChip,
                      selectedFrom === station && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSelectedFrom(selectedFrom === station ? '' : station)}
                  >
                    <Text style={[
                      styles.stationChipText,
                      { color: selectedFrom === station ? '#FFF' : colors.text }
                    ]}>
                      {station}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.filterRow}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>To:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stationScroll}>
                {stations.map((station, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.stationChip,
                      selectedTo === station && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSelectedTo(selectedTo === station ? '' : station)}
                  >
                    <Text style={[
                      styles.stationChipText,
                      { color: selectedTo === station ? '#FFF' : colors.text }
                    ]}>
                      {station}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      {/* Trains List */}
      <ScrollView 
        style={styles.trainsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTrains.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="train-outline" size={64} color={colors.placeholder} />
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>
              No trains available for your search criteria
            </Text>
          </View>
        ) : (
          filteredTrains.map((train) => (
            <View key={train.id} style={[styles.trainCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <View style={styles.trainHeader}>
                <View style={styles.trainInfo}>
                  <Text style={[styles.trainName, { color: colors.text }]}>{train.trainName}</Text>
                  <Text style={[styles.trainNumber, { color: colors.placeholder }]}>
                    #{train.trainNumber}
                  </Text>
                </View>
                <View style={styles.trainType}>
                  <Text style={[styles.typeText, { color: getTypeColor(train.type) }]}>
                    {train.type}
                  </Text>
                </View>
              </View>

              <View style={styles.routeInfo}>
                <View style={styles.routeItem}>
                  <Ionicons name="location" size={16} color={colors.primary} />
                  <Text style={[styles.routeText, { color: colors.text }]}>{train.from}</Text>
                </View>
                <View style={styles.routeArrow}>
                  <Ionicons name="arrow-forward" size={16} color={colors.placeholder} />
                </View>
                <View style={styles.routeItem}>
                  <Ionicons name="location" size={16} color={colors.primary} />
                  <Text style={[styles.routeText, { color: colors.text }]}>{train.to}</Text>
                </View>
              </View>

              <View style={styles.timeInfo}>
                <View style={styles.timeItem}>
                  <Text style={[styles.timeLabel, { color: colors.placeholder }]}>Departure</Text>
                  <Text style={[styles.timeValue, { color: colors.text }]}>{train.departureTime}</Text>
                </View>
                <View style={styles.timeItem}>
                  <Text style={[styles.timeLabel, { color: colors.placeholder }]}>Arrival</Text>
                  <Text style={[styles.timeValue, { color: colors.text }]}>{train.arrivalTime}</Text>
                </View>
              </View>

              <View style={styles.trainFooter}>
                <View style={styles.statusInfo}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(train.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(train.status) }]}>
                    {train.status}
                  </Text>
                </View>
                <View style={styles.seatInfo}>
                  <Ionicons name="people" size={16} color={colors.placeholder} />
                  <Text style={[styles.seatText, { color: colors.placeholder }]}>
                    {train.availableSeats} seats
                  </Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>
                    Rs. {train.price}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.bookButton, { backgroundColor: colors.primary }]}
                onPress={() => handleBookTicket(train)}
                disabled={train.availableSeats === 0}
              >
                <Text style={styles.bookButtonText}>
                  {train.availableSeats === 0 ? 'No Seats' : 'Book Ticket'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 0,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filtersContainer: {
    gap: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 40,
  },
  stationScroll: {
    flex: 1,
  },
  stationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  stationChipText: {
    fontSize: 14,
  },
  trainsList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  trainCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  dateArrow: {
    padding: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainInfo: {
    flex: 1,
  },
  trainName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trainNumber: {
    fontSize: 14,
  },
  trainType: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  routeArrow: {
    marginHorizontal: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatText: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AvailableTrainsScreen; 