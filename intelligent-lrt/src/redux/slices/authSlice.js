import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockAPI } from '../../services/api';

// Async thunk for Google Sign-In
export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (userData, { rejectWithValue }) => {
    try {
      // In a real app, we would send the tokenId to our backend
      // Here we're using our mock API for development
      const response = await mockAPI.login({ email: userData.email });
      
      // Store token in local storage or secure storage for mobile
      // localStorage.setItem('auth_token', response.data.token);
      
      return {
        user: userData,
        role: response.data.role,
        token: response.data.token
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for signing out
export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, call the logout API endpoint
      // For now, we're just simulating the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear token from storage
      // localStorage.removeItem('auth_token');
      
      return {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  user: null,
  role: null, // 'user', 'admin', or 'superadmin'
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Local actions if needed
    clearError: (state) => {
      state.error = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Google Sign In
      .addCase(googleSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to sign in';
      })
      // Handle Sign Out
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to sign out';
      });
  },
});

// Adding a simple logout action for convenience
export const { clearError, setRole } = authSlice.actions;

// Custom logout action
export const logout = () => (dispatch) => {
  dispatch(signOut());
};

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;
