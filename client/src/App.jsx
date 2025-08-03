import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import {useEffect} from 'react';
//import Listings from './pages/Listings.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LandlordDashboard from './pages/LandlordDashboard.jsx';
import TenantDashboard from './pages/TenantDashboard.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/NavBar.jsx';
import useAuth from './hooks/useAuth';
//import Listings from './pages/Listings.jsx';

import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-purple-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();
   // Initialize theme on app load
   useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add("dark");
    }
  }, []);


return (
  <BrowserRouter>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-all duration-500">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      
      {isAuthenticated && <Navbar />}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Root route - redirect to dashboard if authenticated, login if not */}
        <Route
          path="/"
          element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          }
        />

      {/* General Dashboard - this is where users go after login/register */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
              {/* Role-specific dashboards - users can navigate to these if needed */}
              <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landlord-dashboard"
          element={
            <ProtectedRoute>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenant-dashboard"
          element={
            <ProtectedRoute>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
    
          {/* Redirect any unknown routes to dashboard for authenticated users */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

   </Routes>
    </div>
  </BrowserRouter>
);
}