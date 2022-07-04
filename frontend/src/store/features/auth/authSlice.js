import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Api from '../../../api';

const initialState = {
  status: 'idle',
  isAuthenticated: false
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (arg) => {
    const response = await Api.login(arg.username, arg.password);
    return response;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      Api.dropToken();
      localStorage.removeItem('token');
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isAuthenticated = false;
        state.status = 'loading';
      })
      .addCase(loginAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.status = 'idle';
      });
  },
});

export const { logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
