import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as clientsAPI from '../api/clientsAPI';

// Async thunks
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await clientsAPI.getClients(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch clients' });
    }
  }
);

export const fetchClient = createAsyncThunk(
  'clients/fetchClient',
  async (id, { rejectWithValue }) => {
    try {
      const response = await clientsAPI.getClient(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await clientsAPI.createClient(clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await clientsAPI.updateClient(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await clientsAPI.deleteClient(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  currentClient: null,
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

// Clients slice
const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch clients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        // Payload is { data: [clients], pagination: {...} }
        const payload = action.payload;
        
        // Handle potential different response structures
        if (Array.isArray(payload)) {
            state.items = payload;
        } else if (Array.isArray(payload.data)) {
            state.items = payload.data;
            state.pagination = payload.pagination || state.pagination;
        } else if (Array.isArray(payload.items)) {
             state.items = payload.items;
             state.pagination = payload.pagination || state.pagination;
        } else {
            state.items = [];
        }
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch clients';
      });

    // Fetch single client
    builder
      .addCase(fetchClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch client';
      });

    // Create client
    builder
      .addCase(createClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create client';
      });

    // Update client
    builder
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update client';
      });

    // Delete client
    builder
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(c => c.id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete client';
      });
  },
});

export const { clearError, clearCurrentClient } = clientsSlice.actions;
export default clientsSlice.reducer;
