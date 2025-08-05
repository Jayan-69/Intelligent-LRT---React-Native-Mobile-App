const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBooking() {
  try {
    const bookingData = {
      trainNumber: 'I1',
      from: 'Colombo Fort',
      to: 'Kandy',
      departureTime: '08:30',
      passengerDetails: {
        name: 'Test User',
        nic: '123456789V',
        phone: '0771234567',
        email: 'test@example.com',
        seatPreference: 'Window'
      },
      numberOfSeats: 1,
      totalAmount: 250,
      paymentMethod: 'card'
    };

    console.log('🧪 Testing booking API...');
    console.log('📝 Booking data:', bookingData);

    const response = await fetch('http://192.168.153.49:5001/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Booking successful!');
      console.log('🎫 Ticket ID:', result.ticketId);
      console.log('📋 Ticket details:', result.ticket);
    } else {
      console.log('❌ Booking failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBooking(); 