import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import { AdminDashboard } from './pages/AdminDashboard';
import EventsManagement from './pages/EventsManagement';
import CreateEvent from './pages/CreateEvent';
import PersonnelManagement from './pages/PersonnelManagement';
import SkillsManagement from './pages/SkillsManagement';
import AssignmentsManagement from './pages/AssignmentsManagement';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { TechnicianCalendar } from './pages/TechnicianCalendar';
import { TechnicianProfile } from './pages/TechnicianProfile';
import { ToastContainer } from './components/Toast';
import { RegisterPage } from './pages/RegisterPage';
import { LoginForm } from './components/Auth/LoginForm';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const { isAuthenticated, user, initializeAuth, isLoading } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    init();
  }, [initializeAuth]);

  // Afficher l'écran de chargement pendant l'initialisation
  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
              },
            }}
          />
          <ToastContainer />
        </Router>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            {user?.role === 'admin' ? (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/events" element={<EventsManagement onNavigate={() => {}} />} />
                <Route path="/admin/events/create" element={<CreateEvent />} />
                <Route path="/admin/users" element={<PersonnelManagement onNavigate={() => {}} />} />
                <Route path="/admin/skills" element={<SkillsManagement onNavigate={() => {}} />} />
                <Route path="/admin/assignments" element={<AssignmentsManagement onNavigate={() => {}} />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </>
            ) : (
              <>
                <Route path="/technician" element={<TechnicianDashboard />} />
                <Route path="/technician/calendar" element={<TechnicianCalendar />} />
                <Route path="/technician/profile" element={<TechnicianProfile />} />
                <Route path="*" element={<Navigate to="/technician" replace />} />
              </>
            )}
          </Routes>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
            },
          }}
        />
        <ToastContainer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;