import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
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
  );
}

export default App;