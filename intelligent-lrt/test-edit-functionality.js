const fetch = require('node-fetch');

async function testEditFunctionality() {
  const baseUrl = 'http://localhost:5001';
  
  try {
    console.log('🧪 Testing edit functionality for train schedules...\n');
    
    // First, create a test schedule
    console.log('📝 Creating a test schedule...');
    const testScheduleData = {
      trainCode: 'TEST_EDIT_001',
      trainType: 'E',
      from: 'Maradana',
      to: 'Ragama',
      departureTime: '08:00 AM',
      period: 'Morning Office Hours',
      status: 'On Time'
    };
    
    const createResponse = await fetch(`${baseUrl}/api/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testScheduleData),
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.log('❌ Failed to create test schedule:', errorText);
      return;
    }
    
    const createdSchedule = await createResponse.json();
    console.log('✅ Test schedule created:', createdSchedule._id);
    
    // Now test editing the same schedule (should work)
    console.log('\n🔄 Testing edit of the same schedule...');
    const editData = {
      ...testScheduleData,
      departureTime: '09:00 AM',  // Change departure time
      status: 'Delayed'  // Change status
    };
    
    const editResponse = await fetch(`${baseUrl}/api/routes/${createdSchedule._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editData),
    });
    
    if (editResponse.ok) {
      const updatedSchedule = await editResponse.json();
      console.log('✅ Edit successful:', updatedSchedule);
      console.log(`   - Departure time changed to: ${updatedSchedule.departureTime}`);
      console.log(`   - Status changed to: ${updatedSchedule.status}`);
    } else {
      const errorText = await editResponse.text();
      console.log('❌ Edit failed:', errorText);
    }
    
    // Test editing with a different train code (should work)
    console.log('\n🔄 Testing edit with different train code...');
    const editWithNewCodeData = {
      ...editData,
      trainCode: 'TEST_EDIT_002'
    };
    
    const editWithNewCodeResponse = await fetch(`${baseUrl}/api/routes/${createdSchedule._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editWithNewCodeData),
    });
    
    if (editWithNewCodeResponse.ok) {
      const updatedSchedule = await editWithNewCodeResponse.json();
      console.log('✅ Edit with new train code successful:', updatedSchedule.trainCode);
    } else {
      const errorText = await editWithNewCodeResponse.text();
      console.log('❌ Edit with new train code failed:', errorText);
    }
    
    // Test creating another schedule with the same train code (should fail)
    console.log('\n🔄 Testing creation of duplicate train code...');
    const duplicateData = {
      trainCode: 'TEST_EDIT_002',  // Same as the edited schedule
      trainType: 'S',
      from: 'Ragama',
      to: 'Maradana',
      departureTime: '10:00 AM',
      period: 'Morning Office Hours',
      status: 'On Time'
    };
    
    const duplicateResponse = await fetch(`${baseUrl}/api/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(duplicateData),
    });
    
    if (duplicateResponse.ok) {
      console.log('⚠️ Unexpected: Duplicate train code was created');
    } else {
      const errorText = await duplicateResponse.text();
      console.log('✅ Correctly prevented duplicate train code:', errorText);
    }
    
    // Clean up - delete the test schedule
    console.log('\n🧹 Cleaning up test schedule...');
    const deleteResponse = await fetch(`${baseUrl}/api/routes/${createdSchedule._id}`, {
      method: 'DELETE',
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Test schedule deleted successfully');
    } else {
      console.log('⚠️ Failed to delete test schedule');
    }
    
    console.log('\n🎉 Edit functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEditFunctionality(); 