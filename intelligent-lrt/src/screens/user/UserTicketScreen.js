import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const UserTicketScreen = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Tickets</Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>Manage your journey tickets</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Tickets</Text>
        
        <View style={styles.ticketList}>
          <View style={[styles.ticketCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.ticketTitle, { color: colors.text }]}>Ticket #T1001</Text>
            <Text style={[styles.ticketRoute, { color: colors.text }]}>Ragama → Pettah</Text>
            <Text style={[styles.ticketDate, { color: colors.placeholder }]}>July 15, 2025</Text>
            <Text style={[styles.ticketStatus, { color: '#4CAF50' }]}>Active</Text>
          </View>
          
          <View style={[styles.ticketCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.ticketTitle, { color: colors.text }]}>Ticket #T1002</Text>
            <Text style={[styles.ticketRoute, { color: colors.text }]}>Kiribathgoda → Kirulapona</Text>
            <Text style={[styles.ticketDate, { color: colors.placeholder }]}>July 18, 2025</Text>
            <Text style={[styles.ticketStatus, { color: '#4CAF50' }]}>Active</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ticketList: {
    gap: 16,
  },
  ticketCard: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ticketRoute: {
    fontSize: 16,
    marginBottom: 8,
  },
  ticketDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  ticketStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UserTicketScreen;
