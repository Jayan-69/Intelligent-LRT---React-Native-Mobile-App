import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching trains
export const fetchTrains = createAsyncThunk(
  'trains/fetchTrains',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll return mock data
      return [
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
        {
          id: 'TRN003',
          name: 'Rapid 307',
          type: 'Rapid',
          capacity: 220,
          status: 'Maintenance',
          currentLocation: null,
          route: {
            id: 'RT003',
            name: 'Central-North Rapid',
            stations: ['Central Station', 'North Terminal']
          }
        },
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating train location
export const updateTrainLocation = createAsyncThunk(
  'trains/updateLocation',
  async ({ trainId, location }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll just return the data as if it was updated successfully
      return {
        trainId,
        location: {
          ...location,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating train status
export const updateTrainStatus = createAsyncThunk(
  'trains/updateStatus',
  async ({ trainId, status }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      return { trainId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  trains: [],
  isLoading: false,
  error: null,
  selectedTrain: null,
};

export const trainSlice = createSlice({
  name: 'trains',
  initialState,
  reducers: {
    selectTrain: (state, action) => {
      state.selectedTrain = action.payload;
    },
    clearSelectedTrain: (state) => {
      state.selectedTrain = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTrains
      .addCase(fetchTrains.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrains.fulfilled, (state, action) => {
        state.trains = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTrains.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch trains';
      })
      // Handle updateTrainLocation
      .addCase(updateTrainLocation.fulfilled, (state, action) => {
        const { trainId, location } = action.payload;
        const trainIndex = state.trains.findIndex(train => train.id === trainId);
        if (trainIndex !== -1) {
          state.trains[trainIndex].currentLocation = location;
        }
      })
      // Handle updateTrainStatus
      .addCase(updateTrainStatus.fulfilled, (state, action) => {
        const { trainId, status } = action.payload;
        const trainIndex = state.trains.findIndex(train => train.id === trainId);
        if (trainIndex !== -1) {
          state.trains[trainIndex].status = status;
        }
      });
  },
});

export const { selectTrain, clearSelectedTrain } = trainSlice.actions;

// Selectors
export const selectTrains = (state) => state.trains.trains;
export const selectTrainById = (state, trainId) => 
  state.trains.trains.find(train => train.id === trainId);
export const selectActiveTrains = (state) => 
  state.trains.trains.filter(train => train.status === 'Active');
export const selectSelectedTrain = (state) => state.trains.selectedTrain;

export default trainSlice.reducer;
