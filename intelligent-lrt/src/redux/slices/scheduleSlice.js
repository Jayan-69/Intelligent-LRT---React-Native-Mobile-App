import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching schedules
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (scheduleType = 'Weekday', { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll return mock data
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
        'Holiday': [
          { 
            id: '4', 
            trainId: 'Special 303', 
            routeFrom: 'Central Station',
            routeTo: 'North Terminal',
            stops: [
              { station: 'Central Station', arrivalTime: '--:--', departureTime: '12:00 PM' },
              { station: 'East Hub', arrivalTime: '12:15 PM', departureTime: '12:18 PM' },
              { station: 'North Terminal', arrivalTime: '12:30 PM', departureTime: '--:--' },
            ]
          },
        ]
      };
      
      return mockSchedules[scheduleType] || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a new schedule entry
export const createScheduleEntry = createAsyncThunk(
  'schedules/createEntry',
  async ({ scheduleType, scheduleData }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      return {
        id: `${Date.now()}`,
        scheduleType,
        ...scheduleData
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating a schedule entry
export const updateScheduleEntry = createAsyncThunk(
  'schedules/updateEntry',
  async ({ scheduleType, scheduleId, updates }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      return {
        scheduleType,
        scheduleId,
        updates
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a schedule entry
export const deleteScheduleEntry = createAsyncThunk(
  'schedules/deleteEntry',
  async ({ scheduleType, scheduleId }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      return {
        scheduleType,
        scheduleId
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  schedules: {
    Weekday: [],
    Weekend: [],
    Holiday: []
  },
  currentScheduleType: 'Weekday',
  isLoading: false,
  error: null
};

export const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setCurrentScheduleType: (state, action) => {
      state.currentScheduleType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchSchedules
      .addCase(fetchSchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.schedules[state.currentScheduleType] = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch schedules';
      })
      // Handle createScheduleEntry
      .addCase(createScheduleEntry.fulfilled, (state, action) => {
        const { scheduleType, ...scheduleData } = action.payload;
        state.schedules[scheduleType].push(scheduleData);
      })
      // Handle updateScheduleEntry
      .addCase(updateScheduleEntry.fulfilled, (state, action) => {
        const { scheduleType, scheduleId, updates } = action.payload;
        const index = state.schedules[scheduleType].findIndex(
          schedule => schedule.id === scheduleId
        );
        
        if (index !== -1) {
          state.schedules[scheduleType][index] = {
            ...state.schedules[scheduleType][index],
            ...updates
          };
        }
      })
      // Handle deleteScheduleEntry
      .addCase(deleteScheduleEntry.fulfilled, (state, action) => {
        const { scheduleType, scheduleId } = action.payload;
        state.schedules[scheduleType] = state.schedules[scheduleType].filter(
          schedule => schedule.id !== scheduleId
        );
      });
  },
});

export const { setCurrentScheduleType } = scheduleSlice.actions;

// Selectors
export const selectCurrentScheduleType = (state) => state.schedules.currentScheduleType;
export const selectSchedulesByType = (state) => 
  state.schedules.schedules[state.schedules.currentScheduleType];
export const selectAllSchedules = (state) => state.schedules.schedules;

export default scheduleSlice.reducer;
