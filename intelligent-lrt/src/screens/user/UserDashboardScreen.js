import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { getServerBaseUrl } from '../../config/apiConfig';

const UserDashboardScreen = () => {
  const { isDarkMode, colors } = useTheme();
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const baseUrl = await getServerBaseUrl();
      const response = await fetch(`${baseUrl}/api/notices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Sort notices by date descending and take the latest two
      const sortedNotices = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotices(sortedNotices.slice(0, 2));
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to fetch recent notices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const menuItems = [
    {
      title: 'Book New Ticket',
      icon: 'train-outline',
      screen: 'AvailableTrains',
      color: colors.primary,
    },
    {
      title: 'Your Tickets',
      icon: 'ticket-outline',
      screen: 'Tickets',
      color: '#2ecc71',
    },
    {
      title: 'Live Tracking',
      icon: 'location-outline',
      screen: 'Live Tracking',
      color: '#e67e22',
    },
    {
      title: 'Schedules',
      icon: 'calendar-outline',
      screen: 'Schedules',
      color: '#9b59b6',
    },
  ];

  const styles = getStyles(isDarkMode, colors);

  const renderNotices = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.primary} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (notices.length === 0) {
      return <Text style={styles.noticeMessage}>No recent notices.</Text>;
    }
    return (
      <>
        {notices.map((notice) => (
          <View key={notice._id} style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeMessage}>{notice.content}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Notices')}
        >
          <Text style={styles.viewAllText}>View All Notices</Text>
          <Ionicons name="arrow-forward-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Ready for your next journey?</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={[styles.menuItem, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={32} color={item.color} />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notices</Text>
        {renderNotices()}
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const cardMargin = 16;
const cardWidth = (width - cardMargin * 3) / 2;

const getStyles = (isDarkMode, colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingBottom: 20,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.placeholder,
    },
    menuContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: cardMargin,
      marginTop: 10,
    },
    menuItem: {
      width: cardWidth,
      height: cardWidth,
      borderRadius: 12,
      padding: 15,
      justifyContent: 'space-between',
      marginBottom: cardMargin,
      backgroundColor: colors.card,
      borderLeftWidth: 5,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.5 : 0.1,
      shadowRadius: 2,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    section: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    noticeCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    noticeTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    noticeMessage: {
      fontSize: 14,
      color: colors.placeholder,
      lineHeight: 20,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    viewAllText: {
      color: colors.primary,
      fontWeight: 'bold',
      marginRight: 4,
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
    },
  });

export default UserDashboardScreen;
