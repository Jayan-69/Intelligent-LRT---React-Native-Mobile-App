import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import trainReducer from './slices/trainSlice';
import ticketReducer from './slices/ticketSlice';
import scheduleReducer from './slices/scheduleSlice';
import predictionReducer from './slices/predictionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trains: trainReducer,
    tickets: ticketReducer,
    schedules: scheduleReducer,
    predictions: predictionReducer,
  },
});
