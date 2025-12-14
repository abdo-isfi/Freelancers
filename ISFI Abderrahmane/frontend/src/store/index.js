import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clientsReducer from './clientsSlice';
import projectsReducer from './projectsSlice';
import tasksReducer from './tasksSlice';
import timeEntriesReducer from './timeEntriesSlice';
import invoicesReducer from './invoicesSlice';
import notesReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    timeEntries: timeEntriesReducer,
    invoices: invoicesReducer,
    notes: notesReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
