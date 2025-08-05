import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getApiBaseUrl } from '../../config/apiConfig';

const UserTicketScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const apiUrl = await getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/tickets`);
      
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        // Fallback to sample data if API fails
        setTickets(getSampleTickets());
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets(getSampleTickets());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getSampleTickets = () => [
    {
      id: 'T1001',
      trainName: 'Intercity Express 1',
      trainNumber: 'I1',
      from: 'Colombo Fort',
      to: 'Kandy',
      departureTime: '08:30',
      arrivalTime: '11:45',
      date: '2025-01-15',
      status: 'Active',
      seatNumber: 'A12',
      price: 250,
      passengerName: 'John Doe',
      bookingDate: '2025-01-10'
    },
    {
      id: 'T1002',
      trainName: 'Express Train 1',
      trainNumber: 'E1',
      from: 'Ragama',
      to: 'Polgahawela',
      departureTime: '10:00',
      arrivalTime: '11:30',
      date: '2025-01-18',
      status: 'Active',
      seatNumber: 'B08',
      price: 80,
      passengerName: 'John Doe',
      bookingDate: '2025-01-12'
    },
    {
      id: 'T1003',
      trainName: 'Slow Train 1',
      trainNumber: 'S1',
      from: 'Kandy',
      to: 'Colombo Fort',
      departureTime: '14:30',
      arrivalTime: '17:45',
      date: '2025-01-20',
      status: 'Cancelled',
      seatNumber: 'C15',
      price: 180,
      passengerName: 'John Doe',
      bookingDate: '2025-01-14'
    }
  ];

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Cancelled': return '#F44336';
      case 'Completed': return '#2196F3';
      case 'Pending': return '#FF9800';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading your tickets...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Your Tickets</Text>
        <TouchableOpacity 
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AvailableTrains')}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.bookButtonText}>Book New</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color={colors.placeholder} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Tickets Yet</Text>
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>
              You haven't booked any tickets yet. Start by exploring available trains.
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AvailableTrains')}
            >
              <Text style={styles.emptyButtonText}>Browse Trains</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ticketList}>
            {tickets.map((ticket) => (
              <View key={ticket.id} style={[styles.ticketCard, { backgroundColor: colors.surface }]}>
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketInfo}>
                    <Text style={[styles.ticketTitle, { color: colors.text }]}>
                      Ticket #{ticket.id}
                    </Text>
                    <Text style={[styles.ticketDate, { color: colors.placeholder }]}>
                      {formatDate(ticket.date)}
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(ticket.status) }]} />
                    <Text style={[styles.ticketStatus, { color: getStatusColor(ticket.status) }]}>
                      {ticket.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.trainInfo}>
                  <Text style={[styles.trainName, { color: colors.text }]}>{ticket.trainName}</Text>
                  <Text style={[styles.trainNumber, { color: colors.placeholder }]}>
                    #{ticket.trainNumber}
                  </Text>
                </View>

                <View style={styles.routeInfo}>
                  <View style={styles.routeItem}>
                    <Ionicons name="location" size={16} color={colors.primary} />
                    <Text style={[styles.routeText, { color: colors.text }]}>{ticket.from}</Text>
                  </View>
                  <View style={styles.routeArrow}>
                    <Ionicons name="arrow-forward" size={16} color={colors.placeholder} />
                  </View>
                  <View style={styles.routeItem}>
                    <Ionicons name="location" size={16} color={colors.primary} />
                    <Text style={[styles.routeText, { color: colors.text }]}>{ticket.to}</Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.placeholder }]}>Departure</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{ticket.departureTime}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.placeholder }]}>Arrival</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{ticket.arrivalTime}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.placeholder }]}>Seat</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{ticket.seatNumber}</Text>
                  </View>
                </View>

                <View style={styles.ticketFooter}>
                  <View style={styles.passengerInfo}>
                    <Ionicons name="person" size={16} color={colors.placeholder} />
                    <Text style={[styles.passengerText, { color: colors.placeholder }]}>
                      {ticket.passengerName}
                    </Text>
                  </View>
                  <Text style={[styles.priceText, { color: colors.primary }]}>
                    Rs. {ticket.price}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}>
                    <Ionicons name="download" size={16} color={colors.text} />
                    <Text style={[styles.actionText, { color: colors.text }]}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}>
                    <Ionicons name="share" size={16} color={colors.text} />
                    <Text style={[styles.actionText, { color: colors.text }]}>Share</Text>
                  </TouchableOpacity>
                  {ticket.status === 'Active' && (
                    <TouchableOpacity style={[styles.actionButton, { borderColor: '#F44336' }]}>
                      <Ionicons name="close-circle" size={16} color="#F44336" />
                      <Text style={[styles.actionText, { color: '#F44336' }]}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
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
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketList: {
    gap: 16,
  },
  ticketCard: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  ticketStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainNumber: {
    fontSize: 14,
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
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerText: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default UserTicketScreen;
