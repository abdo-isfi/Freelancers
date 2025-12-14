import { Fragment } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { logout } from '@/store/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { RetroGrid } from '../ui/hero-section-dark';
import AppSidebar from './AppSidebar';
import { MiniNavbar } from '../ui/mini-navbar';

function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid 
          angle={65}
          cellSize={60}
          opacity={0.5}
          lightLineColor="#4a4a4a"
          darkLineColor="#2a2a2a"
        />
      </div>
      
      {/* Mini Floating Navbar */}
      <MiniNavbar />
      
      <div className="relative z-10 flex min-h-screen">
        {/* New Sidebar */}
        <AppSidebar user={user} />

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1 transition-all duration-300">
          {/* Top header - Mobile only or for extra actions */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm md:hidden">
            <div className="flex-1 px-4 flex justify-between items-center">
              <span className="text-white font-bold">Freelancer Hub</span>
              {/* Mobile menu button could go here */}
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
