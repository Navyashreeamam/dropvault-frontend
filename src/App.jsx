// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPendingPage from './pages/VerifyPendingPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import MyFilesPage from './pages/MyFilesPage';
import UploadPage from './pages/UploadPage';
import SharedFilesPage from './pages/SharedFilesPage';
import SettingsPage from './pages/SettingsPage';
import TrashPage from './pages/TrashPage';
import PricingPage from './pages/PricingPage';
import GoogleCallback from './components/Auth/GoogleCallback';
import ProtectedRoute from './components/Common/ProtectedRoute';


function App() {
  useEffect(() => {
    // Log environment info
    console.log('🚀 DropVault Starting...');
    console.log('   Environment:', process.env.NODE_ENV);
    console.log('   API URL:', process.env.REACT_APP_API_URL);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '0.75rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              duration: 5000,
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/google-callback" element={<GoogleCallback />} />

          {/* Email Verification Routes */}
          <Route path="/verify-pending" element={<VerifyPendingPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } />
          <Route path="/myfiles" element={
            <ProtectedRoute>
              <MyFilesPage />
            </ProtectedRoute>
          } />
          <Route path="/shared" element={
            <ProtectedRoute>
              <SharedFilesPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/trash" element={
            <ProtectedRoute>
              <TrashPage />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;