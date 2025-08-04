// Real-time service for live updates between admin and user views
// Custom event emitter for React Native compatibility
class RealtimeService {
  constructor() {
    this.listeners = {};
    this.updateInterval = null;
    this.lastUpdate = null;
    this.isRunning = false;
  }

  // Add event listener
  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Emit event
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Start real-time updates
  startUpdates(intervalMs = 10000) {
    if (this.isRunning) {
      console.log('Real-time updates already running');
      return;
    }

    this.isRunning = true;
    this.updateInterval = setInterval(() => {
      this.emit('locationUpdate', {
        timestamp: new Date().toISOString(),
        type: 'locationUpdate'
      });
    }, intervalMs);

    console.log(`Real-time updates started with ${intervalMs}ms interval`);
  }

  // Stop real-time updates
  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isRunning = false;
    console.log('Real-time updates stopped');
  }

  // Emit train location update
  emitTrainLocationUpdate(trainId, latitude, longitude) {
    this.emit('trainLocationUpdate', {
      trainId,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      type: 'trainLocationUpdate'
    });
  }

  // Emit station location update
  emitStationLocationUpdate(stationId, latitude, longitude) {
    this.emit('stationLocationUpdate', {
      stationId,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      type: 'stationLocationUpdate'
    });
  }

  // Subscribe to train location updates
  onTrainLocationUpdate(callback) {
    this.addEventListener('trainLocationUpdate', callback);
  }

  // Subscribe to station location updates
  onStationLocationUpdate(callback) {
    this.addEventListener('stationLocationUpdate', callback);
  }

  // Subscribe to general location updates
  onLocationUpdate(callback) {
    this.addEventListener('locationUpdate', callback);
  }

  // Unsubscribe from updates
  unsubscribe(event, callback) {
    this.removeEventListener(event, callback);
  }

  // Get current status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      interval: this.updateInterval ? 'active' : 'inactive'
    };
  }

  // Test method to verify the service works
  test() {
    console.log('Testing real-time service...');
    this.emit('test', { message: 'Real-time service is working!' });
    return true;
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService; 