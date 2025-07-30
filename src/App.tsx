import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useAppStore } from './store/useAppStore';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { RegisterPage } from './pages/RegisterPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FullScreenLoader } from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, user, initializeAuth } = useAuthStore();
  const { loadInitialData, isLoading } = useAppStore();

  useEffect(() => {
    // Initialiser l'authentification au démarrage
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Charger les données si l'utilisateur est authentifié
    if (isAuthenticated) {
      loadInitialData().catch(error => {
        console.error('Erreur lors du chargement des données:', error);
        // Ne pas afficher l'erreur à l'utilisateur si c'est une erreur 401 (non authentifié)
        if (error.message && !error.message.includes('401')) {
          toast.error('Erreur lors du chargement des données');
        }
      });
    }
  }, [isAuthenticated, loadInitialData]);

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return <FullScreenLoader text="Chargement des données..." />;
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
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
                <Route path="/admin/users" element={<div>Gestion du personnel (à venir)</div>} />
                <Route path="/admin/events" element={<div>Gestion des événements (à venir)</div>} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </>
            ) : (
              <>
                <Route path="/technician" element={<TechnicianDashboard />} />
                <Route path="/technician/profile" element={<div>Profil technicien (à venir)</div>} />
                <Route path="*" element={<Navigate to="/technician" replace />} />
              </>
            )}
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </ErrorBoundary>
  );
}

export default App;