import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching delay predictions for a specific train or route
export const fetchDelayPredictions = createAsyncThunk(
  'predictions/fetchDelayPredictions',
  async ({ trainId, routeId }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend ML service
      // For now, we'll simulate a response with mock prediction data
      
      // Simulate some network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a random delay prediction (0-15 minutes)
      const predictedDelay = Math.floor(Math.random() * 16);
      
      // Generate a random confidence level (70-100%)
      const confidence = 70 + Math.floor(Math.random() * 31);
      
      // Get mock weather factors
      const weatherFactors = {
        rainfall: Math.random() > 0.7 ? (Math.random() * 25).toFixed(1) : 0,
        temperature: (15 + Math.random() * 25).toFixed(1),
        windSpeed: (Math.random() * 30).toFixed(1),
        visibility: Math.random() > 0.8 ? 'reduced' : 'normal',
      };
      
      // Generate risk factors based on weather
      const riskFactors = [];
      if (weatherFactors.rainfall > 10) riskFactors.push('Heavy rain');
      if (weatherFactors.temperature < 20) riskFactors.push('Cold temperature');
      if (weatherFactors.windSpeed > 20) riskFactors.push('High winds');
      if (weatherFactors.visibility === 'reduced') riskFactors.push('Low visibility');
      
      return {
        trainId,
        routeId,
        predictedDelay,
        delayProbability: confidence,
        weatherFactors,
        riskFactors,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching system-wide delay predictions
export const fetchSystemDelayPredictions = createAsyncThunk(
  'predictions/fetchSystemDelayPredictions',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      // Here we'll simulate system-wide delay predictions for different routes
      
      return [
        {
          routeId: 'RT001',
          routeName: 'Central-North Express',
          avgDelayPrediction: 3,
          affectedTrains: 2,
          riskLevel: 'Low',
          updatedAt: new Date().toISOString(),
        },
        {
          routeId: 'RT002',
          routeName: 'East-West Local',
          avgDelayPrediction: 8,
          affectedTrains: 3,
          riskLevel: 'Medium',
          updatedAt: new Date().toISOString(),
        },
        {
          routeId: 'RT003',
          routeName: 'Central-North Rapid',
          avgDelayPrediction: 12,
          affectedTrains: 1,
          riskLevel: 'High',
          updatedAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentPrediction: null,
  systemPredictions: [],
  predictionHistory: [],
  isLoading: false,
  error: null,
};

export const predictionSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    clearPrediction: (state) => {
      state.currentPrediction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchDelayPredictions
      .addCase(fetchDelayPredictions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDelayPredictions.fulfilled, (state, action) => {
        state.currentPrediction = action.payload;
        
        // Store in history, limit to last 10 predictions
        state.predictionHistory.unshift(action.payload);
        if (state.predictionHistory.length > 10) {
          state.predictionHistory.pop();
        }
        
        state.isLoading = false;
      })
      .addCase(fetchDelayPredictions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch prediction';
      })
      
      // Handle fetchSystemDelayPredictions
      .addCase(fetchSystemDelayPredictions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSystemDelayPredictions.fulfilled, (state, action) => {
        state.systemPredictions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSystemDelayPredictions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch system predictions';
      });
  },
});

export const { clearPrediction } = predictionSlice.actions;

// Selectors
export const selectCurrentPrediction = (state) => state.predictions.currentPrediction;
export const selectSystemPredictions = (state) => state.predictions.systemPredictions;
export const selectPredictionHistory = (state) => state.predictions.predictionHistory;
export const selectIsLoadingPrediction = (state) => state.predictions.isLoading;

// Helper selector to get risk level based on predicted delay
export const getDelayRiskLevel = (delayMinutes) => {
  if (delayMinutes < 5) return { level: 'Low', color: '#2ecc71' };
  if (delayMinutes < 10) return { level: 'Medium', color: '#f39c12' };
  return { level: 'High', color: '#e74c3c' };
};

export default predictionSlice.reducer;
