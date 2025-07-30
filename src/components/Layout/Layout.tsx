import React, { useEffect } from 'react';
import { Header } from './Header';
import { useAppStore } from '../../store/useAppStore';
import { LoadingSpinner } from '../LoadingSpinner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loadInitialData, isLoading } = useAppStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="">
          {children}
        </div>
      </main>
    </div>
  );
};