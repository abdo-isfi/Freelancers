import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/ui/login-form';
import { SignupForm } from '@/components/ui/signup-form';
import { HeroImage } from '@/components/ui/hero-image';
import { useDispatch, useSelector } from 'react-redux';
import { login, register as registerUser, clearError } from '@/store/authSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schemas (copied from original pages)
const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const registerSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
  firstName: yup.string().min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters'),
});

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Initialize view based on URL
  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLoginView(false);
    } else {
      setIsLoginView(true);
    }
  }, [location.pathname]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Login Form Hooks
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Register Form Hooks
  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onLogin = (data) => {
    dispatch(clearError());
    dispatch(login(data));
  };

  const onRegister = (data) => {
    dispatch(clearError());
    const { confirmPassword, ...userData } = data;
    dispatch(registerUser(userData));
  };

  const toggleView = (isLogin) => {
    setIsLoginView(isLogin);
    dispatch(clearError());
    // Optional: Update URL without navigation if desired, but user said "no navigation"
    // window.history.pushState(null, '', isLogin ? '/login' : '/register');
  };

  // Mouse hover effect logic
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg)] flex items-center justify-center p-4 overflow-hidden">
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 rounded-xl bg-red-50 dark:bg-red-900/30 p-4 shadow-xl border border-red-200 dark:border-red-800"
          >
            <div className="text-sm font-medium text-red-800 dark:text-red-200">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="card w-[95%] lg:w-[75%] xl:w-[70%] 2xl:w-[65%] h-[
650px] md:h-[700px] relative flex overflow-hidden rounded-3xl shadow-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-pink-400/20 dark:from-purple-300/15 dark:via-blue-300/15 dark:to-pink-300/15 rounded-full blur-3xl transition-opacity duration-300 z-0 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        {/* Left Panel Content (Login Form) */}
        <motion.div
          className="absolute top-0 left-0 w-full lg:w-1/2 h-full z-10"
          initial={{ x: 0, opacity: 1 }}
          animate={{ 
            x: isLoginView ? 0 : "-100%",
            opacity: isLoginView ? 1 : 0 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
           <LoginForm 
              onSubmit={handleLoginSubmit(onLogin)}
              register={loginRegister}
              errors={loginErrors}
              loading={loading}
           />
        </motion.div>

        {/* Right Panel Content (Register Form) */}
        <motion.div
          className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isLoginView ? 0 : 1 
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
           <SignupForm 
              onSubmit={handleSignupSubmit(onRegister)}
              register={signupRegister}
              errors={signupErrors}
              loading={loading}
              onLoginClick={() => toggleView(true)}
           />
        </motion.div>

        {/* Hero Image Overlay - Slides between sides */}
        <motion.div
          className="hidden lg:block absolute top-0 w-1/2 h-full z-20 overflow-hidden"
          initial={false}
          animate={{ 
            left: isLoginView ? "50%" : "0%" 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 25,
            duration: 0.6
          }}
        >
          <HeroImage 
            isLoginView={isLoginView} 
            onToggle={() => toggleView(!isLoginView)} 
          />
        </motion.div>

      </div>
    </div>
  );
};

export default AuthPage;
