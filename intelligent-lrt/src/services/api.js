import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API URL in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Handle token refresh logic here
      
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (tokenId) => api.post('/auth/google', { tokenId }),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// Trains API
export const trainsAPI = {
  getAllTrains: () => api.get('/trains'),
  getTrainById: (id) => api.get(`/trains/${id}`),
  updateTrainLocation: (id, location) => api.put(`/trains/${id}/location`, { location }),
  updateTrainStatus: (id, status) => api.put(`/trains/${id}/status`, { status }),
};

// Schedule API
export const scheduleAPI = {
  getSchedulesByType: (type) => api.get(`/schedules?type=${type}`),
  createSchedule: (scheduleData) => api.post('/schedules', scheduleData),
  updateSchedule: (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData),
  deleteSchedule: (id) => api.delete(`/schedules/${id}`),
};

// Tickets API
export const ticketsAPI = {
  getUserTickets: (userId) => api.get(`/tickets?userId=${userId}`),
  bookTicket: (ticketData) => api.post('/tickets', ticketData),
  validateTicket: (id, validationData) => api.put(`/tickets/${id}/validate`, validationData),
};

// Prediction API
export const predictionAPI = {
  getDelayPrediction: (params) => api.get('/predictions/delay', { params }),
  getSystemPredictions: () => api.get('/predictions/system'),
};

// Notices API
export const noticesAPI = {
  getNotices: () => api.get('/notices'),
};

// Mock API functions for development (without real backend)
export const mockAPI = {
  // Authentication
  login: async (credentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (credentials.email.includes('admin')) {
      return { data: { 
        user: { id: 'admin-123', name: 'Admin User', email: credentials.email },
        role: credentials.email.includes('super') ? 'superadmin' : 'admin',
        token: 'mock-jwt-token'
      }};
    }
    
    return { data: { 
            user: { id: 'user-123', name: 'User', email: credentials.email },
      role: 'user',
      token: 'mock-jwt-token'
    }};
  },
  
  // Trains
  getAllTrains: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { data: [
      {
        id: 'TRN001',
        name: 'Express 101',
        type: 'Express',
        capacity: 250,
        status: 'Active',
        currentLocation: {
          latitude: 12.9716,
          longitude: 77.5946,
          lastUpdated: new Date().toISOString(),
          speed: 45,
        },
        route: {
          id: 'RT001',
          name: 'Central-North Express',
          stations: ['Central Station', 'East Hub', 'North Terminal']
        }
      },
      {
        id: 'TRN002',
        name: 'Local 205',
        type: 'Local',
        capacity: 200,
        status: 'Active',
        currentLocation: {
          latitude: 12.9716,
          longitude: 77.6946,
          lastUpdated: new Date().toISOString(),
          speed: 30,
        },
        route: {
          id: 'RT002',
          name: 'East-West Local',
          stations: ['East Hub', 'Central Station', 'West Junction']
        }
      },
    ]};
  },
  
  // Schedule
  getSchedulesByType: async (type) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockSchedules = {
      'Weekday': [
        { 
          id: '1', 
          trainId: 'Express 101', 
          routeFrom: 'Central Station',
          routeTo: 'North Terminal',
          stops: [
            { station: 'Central Station', arrivalTime: '--:--', departureTime: '10:00 AM' },
            { station: 'East Hub', arrivalTime: '10:15 AM', departureTime: '10:18 AM' },
            { station: 'North Terminal', arrivalTime: '10:30 AM', departureTime: '--:--' },
          ]
        },
        { 
          id: '2', 
          trainId: 'Local 205', 
          routeFrom: 'East Hub',
          routeTo: 'West Junction',
          stops: [
            { station: 'East Hub', arrivalTime: '--:--', departureTime: '10:15 AM' },
            { station: 'Central Station', arrivalTime: '10:25 AM', departureTime: '10:28 AM' },
            { station: 'West Junction', arrivalTime: '10:45 AM', departureTime: '--:--' },
          ]
        },
      ],
      'Weekend': [
        { 
          id: '3', 
          trainId: 'Express 102', 
          routeFrom: 'Central Station',
          routeTo: 'North Terminal',
          stops: [
            { station: 'Central Station', arrivalTime: '--:--', departureTime: '11:00 AM' },
            { station: 'East Hub', arrivalTime: '11:15 AM', departureTime: '11:18 AM' },
            { station: 'North Terminal', arrivalTime: '11:30 AM', departureTime: '--:--' },
          ]
        },
      ],
    };
    
    return { data: mockSchedules[type] || [] };
  },
  
  // Tickets
  getUserTickets: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { data: [
      {
        id: 'TKT001',
        userId: userId,
        from: 'Central Station',
        to: 'North Terminal',
        date: '2025-07-20',
        time: '10:00 AM',
        price: 12.50,
        status: 'Upcoming',
        qrCode: 'TKT001-USERID-20250720-1000',
        trainId: 'Express 101',
        purchasedAt: '2025-07-18T14:30:00Z'
      },
      {
        id: 'TKT002',
        userId: userId,
        from: 'Central Station',
        to: 'East Hub',
        date: '2025-07-25',
        time: '11:15 AM',
        price: 8.00,
        status: 'Upcoming',
        qrCode: 'TKT002-USERID-20250725-1115',
        trainId: 'Local 205',
        purchasedAt: '2025-07-18T15:45:00Z'
      },
    ]};
  },
  
  // Notices
  getNotices: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: [
      {
        id: '1',
        title: 'Weekend Schedule Update',
        content: 'Please be advised that weekend train services will operate on a revised schedule starting this Saturday. Check the app for the latest timings.',
        date: '2025-08-05T10:00:00Z',
        level: 'info',
      },
      {
        id: '2',
        title: 'System Maintenance',
        content: 'Our booking system will be temporarily unavailable for scheduled maintenance on Sunday from 2:00 AM to 4:00 AM.',
        date: '2025-08-04T15:30:00Z',
        level: 'warning',
      },
    ]};
  },
  
  // Predictions
  getDelayPrediction: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const predictedDelay = Math.floor(Math.random() * 16);
    const confidence = 70 + Math.floor(Math.random() * 31);
    
    return { data: {
      trainId: params.trainId,
      routeId: params.routeId,
      predictedDelay,
      delayProbability: confidence,
      weatherFactors: {
        rainfall: Math.random() > 0.7 ? (Math.random() * 25).toFixed(1) : 0,
        temperature: (15 + Math.random() * 25).toFixed(1),
        windSpeed: (Math.random() * 30).toFixed(1),
        visibility: Math.random() > 0.8 ? 'reduced' : 'normal',
      },
    }};
  },
};

// Export default API or mock API based on environment
const isProduction = process.env.NODE_ENV === 'production';
export default isProduction ? api : mockAPI;
