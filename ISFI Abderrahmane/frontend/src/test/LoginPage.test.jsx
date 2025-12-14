import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AuthPage from '@/pages/AuthPage';
import authReducer from '@/store/authSlice';
import { vi } from 'vitest';

// Mock HeroImage to avoid asset import issues
vi.mock('../../components/ui/hero-image', () => ({
  HeroImage: () => <div data-testid="hero-image">Hero Image</div>
}));

// Mock store setup
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      }
    }
  });
};

// Test wrapper
const renderWithProviders = (component) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('AuthPage', () => {
  it('renders login form by default', () => {
    renderWithProviders(<AuthPage />);
    
    // Check for email input (might be multiple due to Login/Signup forms)
    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    expect(emailInputs.length).toBeGreaterThan(0);
    expect(emailInputs[0]).toBeInTheDocument();
    
    // Check for password input
    const passwordInputs = screen.getAllByPlaceholderText(/password/i);
    expect(passwordInputs.length).toBeGreaterThan(0);
    expect(passwordInputs[0]).toBeInTheDocument();
    
    // Check for Sign In button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
