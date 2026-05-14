async function updateLocation() {
  try {
    const response = await fetch('http://localhost:5000/api/tracking/live-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        driverMobileNumber: '9345577285',
        latitude: 11.002294723400357,
        longitude: 77.04279208164587,
        status: 'morning_pickup'
      })
    });
    const data = await response.json();
    console.log('Location updated successfully:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to update location:', error.message);
  }
}

updateLocation();
