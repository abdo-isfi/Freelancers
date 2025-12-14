import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as timeEntriesAPI from '../api/timeEntriesAPI';

// Async thunks
export const fetchTimeEntries = createAsyncThunk(
  'timeEntries/fetchTimeEntries',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await timeEntriesAPI.getTimeEntries(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch time entries' });
    }
  }
);

export const createTimeEntry = createAsyncThunk(
  'timeEntries/createTimeEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await timeEntriesAPI.createTimeEntry(entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateTimeEntry = createAsyncThunk(
  'timeEntries/updateTimeEntry',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await timeEntriesAPI.updateTimeEntry(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteTimeEntry = createAsyncThunk(
  'timeEntries/deleteTimeEntry',
  async (id, { rejectWithValue }) => {
    try {
      await timeEntriesAPI.deleteTimeEntry(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const startTimer = createAsyncThunk(
  'timeEntries/startTimer',
  async (timerData, { rejectWithValue }) => {
    try {
      const response = await timeEntriesAPI.startTimer(timerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const stopTimer = createAsyncThunk(
  'timeEntries/stopTimer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await timeEntriesAPI.stopTimer(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  activeTimer: null,
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

// Time entries slice
const timeEntriesSlice = createSlice({
  name: 'timeEntries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveTimer: (state, action) => {
      state.activeTimer = action.payload;
    },
    clearActiveTimer: (state) => {
      state.activeTimer = null;
    },
    updateTimerDuration: (state, action) => {
      if (state.activeTimer) {
        state.activeTimer.duration = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch time entries
    builder
      .addCase(fetchTimeEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeEntries.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures
        const payload = action.payload;
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
      .addCase(fetchTimeEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch time entries';
      });

    // Create time entry
    builder
      .addCase(createTimeEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTimeEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTimeEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create time entry';
      });

    // Update time entry
    builder
      .addCase(updateTimeEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTimeEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTimeEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update time entry';
      });

    // Delete time entry
    builder
      .addCase(deleteTimeEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTimeEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(e => e.id !== action.payload);
      })
      .addCase(deleteTimeEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete time entry';
      });

    // Start timer
    builder
      .addCase(startTimer.pending, (state) => {
        state.loading = true;
      })
      .addCase(startTimer.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTimer = action.payload;
      })
      .addCase(startTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to start timer';
      });

    // Stop timer
    builder
      .addCase(stopTimer.pending, (state) => {
        state.loading = true;
      })
      .addCase(stopTimer.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTimer = null;
        const index = state.items.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(stopTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to stop timer';
      });
  },
});

export const { clearError, setActiveTimer, clearActiveTimer, updateTimerDuration } = timeEntriesSlice.actions;
export default timeEntriesSlice.reducer;
