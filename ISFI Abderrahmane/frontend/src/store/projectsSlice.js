import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as projectsAPI from '../api/projectsAPI';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProjects(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch projects' });
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProject(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.updateProject(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectsAPI.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  currentProject: null,
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

// Projects slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        // Handle potential different response structures
        const payload = action.payload;
        if (Array.isArray(payload)) {
            state.items = payload;
        } else if (Array.isArray(payload.data)) {
            state.items = payload.data;
            state.pagination = payload.pagination || state.pagination;
        } else if (Array.isArray(payload.items)) {
            // If payload is just an array, pagination might not be present or needs to be reset
            state.pagination = initialState.pagination; 
        } else if (payload && typeof payload === 'object') {
            // Prioritize 'data' array, then 'items' array
            if (Array.isArray(payload.data)) {
                state.items = payload.data;
            } else if (Array.isArray(payload.items)) {
                state.items = payload.items;
            } else {
                state.items = []; // No array found in expected properties
            }
            // Extract pagination if present
            if (payload.pagination && typeof payload.pagination === 'object') {
                state.pagination = { ...state.pagination, ...payload.pagination };
            } else {
                state.pagination = initialState.pagination; // Reset or default pagination
            }
        } else {
            state.items = [];
            state.pagination = initialState.pagination;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch projects';
      });

    // Fetch single project
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch project';
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create project';
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update project';
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete project';
      });
  },
});

export const { clearError, clearCurrentProject } = projectsSlice.actions;
export default projectsSlice.reducer;
