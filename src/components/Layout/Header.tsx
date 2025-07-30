import React, { useState } from 'react';
import { LogOut, Bell, User, Calendar, Users, Menu, X, Settings, Briefcase, Star, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    ...(user?.role === 'admin' ? [
      { name: 'Dashboard', href: '/admin', icon: Calendar },
      { name: 'Personnel', href: '/admin/users', icon: Users },
      { name: 'Compétences', href: '/admin/skills', icon: Star },
      { name: 'Affectations', href: '/admin/assignments', icon: Briefcase },
    ] : [
      { name: 'Mes Missions', href: '/technician', icon: Calendar },
      { name: 'Mon Calendrier', href: '/technician/calendar', icon: CalendarDays },
      { name: 'Profil', href: '/technician/profile', icon: User },
    ])
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg border-b border-blue-500/20 sticky top-0 z-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
                  Esil-Events
                </span>
                <span className="text-xs text-blue-200 opacity-80">Gestion Événementielle</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-blue-200'
                  }`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-blue-100 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg group">
              <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-blue-200 capitalize">{user?.role}</p>
              </div>
              
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg cursor-pointer group">
                <span className="text-sm font-medium text-white group-hover:scale-110 transition-transform">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>

            {/* Settings */}
            <button className="p-2 text-blue-100 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg group">
              <Settings className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-blue-100 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg group"
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-blue-100 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-blue-700/95 backdrop-blur-sm border-t border-blue-500/20`}>
        <nav className="px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};