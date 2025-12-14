import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

// Lazy load pages
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const ClientsPage = React.lazy(() => import('@/pages/ClientsPage'));
const ClientDetailPage = React.lazy(() => import('@/pages/ClientDetailPage'));
const ProjectsPage = React.lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailPage = React.lazy(() => import('@/pages/ProjectDetailPage'));
const TasksPage = React.lazy(() => import('@/pages/TasksPage'));
const TimeTrackingPage = React.lazy(() => import('@/pages/TimeTrackingPage'));
const InvoicesPage = React.lazy(() => import('@/pages/InvoicesPage'));
const InvoiceDetailPage = React.lazy(() => import('@/pages/InvoiceDetailPage'));
const NotesPage = React.lazy(() => import('@/pages/NotesPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const ItemManager = React.lazy(() => import('@/components/ItemManager'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Protected routes with layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Clients */}
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientDetailPage />} />
              
              {/* Projects */}
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              
              {/* Tasks */}
              <Route path="/tasks" element={<TasksPage />} />
              
              {/* Time Tracking */}
              <Route path="/time-tracking" element={<TimeTrackingPage />} />
              
              {/* Invoices */}
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
              
              {/* Notes */}
              <Route path="/notes" element={<NotesPage />} />
              
              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Items Demo */}
              <Route path="/items" element={<ItemManager />} />

            </Route>
          </Route>

          {/* 404 - Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
