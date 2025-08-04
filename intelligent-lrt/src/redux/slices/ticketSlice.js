import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching user tickets
export const fetchUserTickets = createAsyncThunk(
  'tickets/fetchUserTickets',
  async (userId, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll return mock data
      return [
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
        {
          id: 'TKT003',
          userId: userId,
          from: 'East Hub',
          to: 'West Junction',
          date: '2025-07-15',
          time: '09:30 AM',
          price: 10.00,
          status: 'Used',
          qrCode: 'TKT003-USERID-20250715-0930',
          trainId: 'Local 205',
          purchasedAt: '2025-07-10T08:15:00Z'
        }
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for booking a new ticket
export const bookTicket = createAsyncThunk(
  'tickets/bookTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll simulate a successful booking
      const newTicket = {
        id: `TKT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        userId: ticketData.userId,
        from: ticketData.from,
        to: ticketData.to,
        date: ticketData.date,
        time: ticketData.time,
        price: ticketData.price,
        status: 'Upcoming',
        qrCode: `TKT-${ticketData.userId}-${ticketData.date.replace(/-/g, '')}-${ticketData.time.replace(/\D/g, '')}`,
        trainId: ticketData.trainId,
        purchasedAt: new Date().toISOString()
      };
      
      return newTicket;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for validating a ticket
export const validateTicket = createAsyncThunk(
  'tickets/validateTicket',
  async ({ ticketId, validateData }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to your backend
      return {
        ticketId,
        status: 'Used',
        validatedAt: new Date().toISOString(),
        validatedBy: validateData.validatedBy
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userTickets: [],
  isLoading: false,
  error: null,
  currentTicket: null,
};

export const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    selectTicket: (state, action) => {
      state.currentTicket = action.payload;
    },
    clearSelectedTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserTickets
      .addCase(fetchUserTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.userTickets = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tickets';
      })
      // Handle bookTicket
      .addCase(bookTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bookTicket.fulfilled, (state, action) => {
        state.userTickets.unshift(action.payload);
        state.currentTicket = action.payload;
        state.isLoading = false;
      })
      .addCase(bookTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to book ticket';
      })
      // Handle validateTicket
      .addCase(validateTicket.fulfilled, (state, action) => {
        const { ticketId, status } = action.payload;
        const ticketIndex = state.userTickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex !== -1) {
          state.userTickets[ticketIndex].status = status;
        }
      });
  },
});

export const { selectTicket, clearSelectedTicket } = ticketSlice.actions;

// Selectors
export const selectUserTickets = (state) => state.tickets.userTickets;
export const selectUpcomingTickets = (state) => 
  state.tickets.userTickets.filter(ticket => ticket.status === 'Upcoming');
export const selectUsedTickets = (state) => 
  state.tickets.userTickets.filter(ticket => ticket.status === 'Used');
export const selectCurrentTicket = (state) => state.tickets.currentTicket;

export default ticketSlice.reducer;
