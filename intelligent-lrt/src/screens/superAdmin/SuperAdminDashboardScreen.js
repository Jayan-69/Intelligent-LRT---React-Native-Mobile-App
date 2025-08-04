import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const SuperAdminDashboardScreen = () => {
  const { colors } = useTheme();

  const dashboardItems = [
    {
      id: 1,
      title: 'Train Management',
      description: 'Add, edit, and manage train information',
      icon: 'train',
      screen: 'Train Management'
    },
    {
      id: 2,
      title: 'Schedule Management',
      description: 'Manage train schedules and routes',
      icon: 'calendar',
      screen: 'Schedule Management'
    },
    {
      id: 3,
      title: 'Notice Management',
      description: 'Create and manage system notices',
      icon: 'megaphone',
      screen: 'Notice Management'
    },
    {
      id: 4,
      title: 'System Analytics',
      description: 'View system performance and statistics',
      icon: 'analytics',
      screen: 'Analytics',
      disabled: true
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.text }]}>Super Admin Dashboard</Text>
        <Text style={[styles.subHeader, { color: colors.placeholder }]}>System-wide management and controls</Text>
      </View>

      <View style={styles.grid}>
        {dashboardItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card, 
              { backgroundColor: colors.surface },
              item.disabled && { opacity: 0.5 }
            ]}
            onPress={() => {
              if (item.disabled) {
                Alert.alert('Coming Soon', `${item.title} will be available soon!`);
              } else {
                // Navigation will be handled by the tab navigator
                console.log(`Navigate to ${item.screen}`);
              }
            }}
          >
            <Ionicons name={item.icon} size={40} color={colors.primary} style={styles.cardIcon} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.cardDescription, { color: colors.placeholder }]}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SuperAdminDashboardScreen;
