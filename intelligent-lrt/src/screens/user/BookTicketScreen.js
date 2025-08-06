import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getApiBaseUrl } from '../../config/apiConfig';

const BookTicketScreen = ({ route, navigation }) => {
  // Correctly extract both the train and the selected date from navigation parameters
  const { train, date } = route.params; // Ensure date is destructured

  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    nic: '',
    phone: '',
    email: '',
    seatPreference: 'Any'
  });
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const seatPreferences = ['Any', 'Window', 'Aisle', 'Front', 'Back'];
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card' },
    { id: 'mobile', name: 'Mobile Payment', icon: 'phone-portrait' },
    { id: 'cash', name: 'Cash at Station', icon: 'cash' }
  ];

  const calculateTotal = () => {
    return train.price * selectedSeats;
  };

    const handleBookTicket = async () => {
    // Validate form
    if (!passengerDetails.name.trim()) {
      Alert.alert('Error', 'Please enter passenger name');
      return;
    }
    if (!passengerDetails.nic.trim()) {
      Alert.alert('Error', 'Please enter NIC number');
      return;
    }
    if (!passengerDetails.phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = await getApiBaseUrl();
      const bookingData = {
        userId: user.id,
        trainId: train.id,
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        from: train.from,
        to: train.to,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        date: date, // Correctly use the date from route params
        passengerDetails,
        numberOfSeats: selectedSeats,
        totalAmount: calculateTotal(),
        paymentMethod
      };

      const response = await fetch(`${apiUrl}/api/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Booking successful:', result);
        Alert.alert(
          'Booking Successful!',
          `Your ticket has been booked successfully.\nTicket ID: ${result.ticketId}\nAmount: Rs. ${calculateTotal()}`,
          [
            {
              text: 'View Ticket',
              onPress: () => navigation.navigate('UserTicketScreen')
            },
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Booking Failed',
        'Unable to book ticket. Please try again later.',
        [
          {
            text: 'Try Again',
            onPress: () => setLoading(false)
          },
          {
            text: 'Cancel',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Book Ticket</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Train Details */}
      <View style={[styles.trainCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Train Details</Text>
        
        <View style={styles.trainInfo}>
          <View style={styles.trainHeader}>
            <Text style={[styles.trainName, { color: colors.text }]}>{train.trainName}</Text>
            <Text style={[styles.trainNumber, { color: colors.placeholder }]}>
              #{train.trainNumber}
            </Text>
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
            <View style={styles.timeItem}>
              <Text style={[styles.timeLabel, { color: colors.placeholder }]}>Price</Text>
              <Text style={[styles.timeValue, { color: colors.primary }]}>Rs. {train.price}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Passenger Details */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Passenger Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            placeholder="Enter full name"
            placeholderTextColor={colors.placeholder}
            value={passengerDetails.name}
            onChangeText={(text) => setPassengerDetails({...passengerDetails, name: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>NIC Number *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            placeholder="Enter NIC number"
            placeholderTextColor={colors.placeholder}
            value={passengerDetails.nic}
            onChangeText={(text) => setPassengerDetails({...passengerDetails, nic: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            placeholder="Enter phone number"
            placeholderTextColor={colors.placeholder}
            value={passengerDetails.phone}
            onChangeText={(text) => setPassengerDetails({...passengerDetails, phone: text})}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Email (Optional)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            placeholder="Enter email address"
            placeholderTextColor={colors.placeholder}
            value={passengerDetails.email}
            onChangeText={(text) => setPassengerDetails({...passengerDetails, email: text})}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Seat Preference</Text>
          <View style={styles.preferenceContainer}>
            {seatPreferences.map((preference) => (
              <TouchableOpacity
                key={preference}
                style={[
                  styles.preferenceChip,
                  passengerDetails.seatPreference === preference && { backgroundColor: colors.primary }
                ]}
                onPress={() => setPassengerDetails({...passengerDetails, seatPreference: preference})}
              >
                <Text style={[
                  styles.preferenceText,
                  { color: passengerDetails.seatPreference === preference ? '#FFF' : colors.text }
                ]}>
                  {preference}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Number of Seats */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Number of Seats</Text>
        
        <View style={styles.seatSelector}>
          <TouchableOpacity
            style={[styles.seatButton, { backgroundColor: colors.primary }]}
            onPress={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
            disabled={selectedSeats <= 1}
          >
            <Ionicons name="remove" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <Text style={[styles.seatCount, { color: colors.text }]}>{selectedSeats}</Text>
          
          <TouchableOpacity
            style={[styles.seatButton, { backgroundColor: colors.primary }]}
            onPress={() => setSelectedSeats(Math.min(train.availableSeats, selectedSeats + 1))}
            disabled={selectedSeats >= train.availableSeats}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.seatInfo, { color: colors.placeholder }]}>
          {train.availableSeats} seats available
        </Text>
      </View>

      {/* Payment Method */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              paymentMethod === method.id && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => setPaymentMethod(method.id)}
          >
            <Ionicons 
              name={method.icon} 
              size={24} 
              color={paymentMethod === method.id ? colors.primary : colors.placeholder} 
            />
            <Text style={[
              styles.paymentText,
              { color: paymentMethod === method.id ? colors.primary : colors.text }
            ]}>
              {method.name}
            </Text>
            {paymentMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Total and Book Button */}
      <View style={[styles.totalSection, { backgroundColor: colors.surface }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount:</Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>
            Rs. {calculateTotal()}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.bookButton,
            { backgroundColor: colors.primary },
            loading && { opacity: 0.7 }
          ]}
          onPress={handleBookTicket}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  trainCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trainInfo: {
    gap: 16,
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trainNumber: {
    fontSize: 14,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  preferenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  preferenceText: {
    fontSize: 14,
  },
  seatSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 8,
  },
  seatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatCount: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  seatInfo: {
    textAlign: 'center',
    fontSize: 14,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  totalSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookTicketScreen; 