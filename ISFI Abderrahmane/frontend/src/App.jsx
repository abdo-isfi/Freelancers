import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { setActiveTimer } from './store/timeEntriesSlice';
import { getActiveTimer } from './utils/timerService';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  // Initialize timer from localStorage on app start
  useEffect(() => {
    const savedTimer = getActiveTimer();
    if (savedTimer) {
      dispatch(setActiveTimer(savedTimer));
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <AppRoutes />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
