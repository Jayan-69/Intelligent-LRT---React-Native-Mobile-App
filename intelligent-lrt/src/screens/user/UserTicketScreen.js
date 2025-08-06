import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../../context/ThemeContext';
import { getApiBaseUrl } from '../../config/apiConfig';

const UserTicketScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setRefreshing(false);
      setTickets([]); // Clear tickets if user logs out or is not available
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiUrl = await getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/tickets/user/${user.id}`);

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch tickets, server response:', errorText);
        setError('Failed to fetch tickets. Please try again.');
      }
    } catch (e) {
      console.error('Error fetching tickets:', e);
      setError('Could not connect to the server. Check your network.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    // Fetch tickets when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTickets();
    });
    return unsubscribe;
  }, [navigation, fetchTickets]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const TicketCard = ({ ticket }) => {
    // Use the secure QR code value from the backend
    const qrCodeData = ticket.qrCodeValue || JSON.stringify({ ticketId: ticket._id });

    return (
      <View style={[styles.ticketCard, { backgroundColor: colors.surface }]}>
        <View style={styles.ticketHeader}>
          <Text style={[styles.trainName, { color: colors.text }]}>{ticket.trainDetails.trainName}</Text>
          <Text style={[styles.ticketId, { color: colors.placeholder }]}>ID: {ticket._id.slice(-6)}</Text>
        </View>

        <View style={styles.ticketBody}>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrCodeData}
              size={120}
              backgroundColor={colors.surface}
              color={colors.text}
              logo={require('../../../assets/images/train-logo.png')}
              logoSize={30}
              logoBackgroundColor='transparent'
            />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.routeInfo}>
              <Text style={[styles.station, { color: colors.text }]}>{ticket.trainDetails.from}</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.placeholder} style={styles.arrow} />
              <Text style={[styles.station, { color: colors.text }]}>{ticket.trainDetails.to}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.placeholder} />
              <Text style={[styles.detailText, { color: colors.text }]}>{formatDate(ticket.trainDetails.date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={colors.placeholder} />
              <Text style={[styles.detailText, { color: colors.text }]}>{ticket.trainDetails.departureTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={16} color={colors.placeholder} />
              <Text style={[styles.detailText, { color: colors.text }]}>{ticket.passengerDetails.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={16} color={colors.placeholder} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {ticket.seatInfo.numberOfSeats} Seat(s): {ticket.seatInfo.seatNumbers.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.ticketFooter, { borderTopColor: colors.border }]}>
          <Text style={[styles.status, { color: ticket.status === 'Confirmed' ? colors.success : colors.error }]}>
            Status: {ticket.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Your Tickets</Text>
        <TouchableOpacity 
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AvailableTrains')}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.bookButtonText}>Book New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.primary }]} onPress={onRefresh}>
              <Text style={styles.bookButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              You have no tickets yet.
            </Text>
            <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('AvailableTrains')}>
              <Text style={styles.bookButtonText}>Book a New Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)
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
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#FFF',
    marginLeft: 5,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: '30%',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'Roboto-Bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
  },
  ticketCard: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  trainName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  ticketId: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  ticketBody: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  qrContainer: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  station: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
    flexShrink: 1,
  },
  arrow: {
    marginHorizontal: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  ticketFooter: {
    borderTopWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
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
