import { useSelector } from 'react-redux';

/**
 * Custom hook to access auth state
 */
export function useAuth() {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
}

export default useAuth;
