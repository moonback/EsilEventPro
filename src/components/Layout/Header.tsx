import React, { useState, useEffect } from 'react';
import { LogOut, Bell, User, Calendar, Users, Menu, X, Settings, Briefcase, Star, CalendarDays, ChevronDown, Search, Home, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nouvelle affectation', message: 'Vous avez été assigné à un nouvel événement', time: '2 min', unread: true, type: 'assignment' },
    { id: 2, title: 'Événement mis à jour', message: 'Les détails de l\'événement ont été modifiés', time: '1 heure', unread: true, type: 'update' },
    { id: 3, title: 'Rappel événement', message: 'Votre événement commence dans 30 minutes', time: '3 heures', unread: false, type: 'reminder' },
  ]);

  const navigation = [
    ...(user?.role === 'admin' ? [
      { name: 'Dashboard', href: '/admin', icon: Home },
      { name: 'Événements', href: '/admin/events', icon: Calendar },
      { name: 'Personnel', href: '/admin/users', icon: Users },
      { name: 'Compétences', href: '/admin/skills', icon: Star },
      { name: 'Affectations', href: '/admin/assignments', icon: Briefcase },
    ] : [
      { name: 'Mes Missions', href: '/technician', icon: Calendar },
      { name: 'Mon Calendrier', href: '/technician/calendar', icon: CalendarDays },
      { name: 'Profil', href: '/technician/profile', icon: User },
    ])
  ];

  const userMenuItems = [
    { name: 'Mon Profil', href: '/profile', icon: User },
    { name: 'Paramètres', href: '/settings', icon: Settings },
    { name: 'Aide', href: '/help', icon: HelpCircle },
    { name: 'Sécurité', href: '/security', icon: Shield },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserMenuOpen(false);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu') && !target.closest('.notifications-menu')) {
        setIsUserMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-secondary-200/50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Sparkles className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                  Esil-Events
                </span>
                <span className="text-xs text-secondary-500 group-hover:text-secondary-600 transition-colors duration-300">
                  Gestion Événementielle
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link relative group ${
                    isActive ? 'active' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                  <span>{item.name}</span>
                  
                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse" />
                  )}
                  
                  {/* Effet de survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </Link>
              );
            })}
          </nav>

          {/* Right side - User menu and notifications */}
          <div className="flex items-center space-x-3">
            {/* Search button */}
            <button className="p-2 text-secondary-600 hover:text-primary-600 transition-all duration-300 hover:bg-primary-50 rounded-lg group">
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {/* Notifications */}
            <div className="relative notifications-menu">
              <button 
                onClick={toggleNotifications}
                className="relative p-2 text-secondary-600 hover:text-primary-600 transition-all duration-300 hover:bg-primary-50 rounded-lg group"
              >
                <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-error-500 to-error-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-secondary-200 z-50 animate-scale-in">
                  <div className="p-4 border-b border-secondary-100 bg-gradient-to-r from-secondary-50 to-white">
                    <h3 className="text-lg font-semibold text-secondary-900">Notifications</h3>
                    <p className="text-sm text-secondary-600">{unreadCount} non lues</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-secondary-500">
                        <Bell className="h-12 w-12 mx-auto mb-3 text-secondary-300" />
                        <p className="font-medium">Aucune notification</p>
                        <p className="text-sm">Vous serez notifié des nouvelles activités</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`p-4 border-b border-secondary-100 hover:bg-secondary-50 cursor-pointer transition-all duration-200 ${
                            notification.unread ? 'bg-primary-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className={`text-sm font-medium ${notification.unread ? 'text-primary-900' : 'text-secondary-900'}`}>
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                                )}
                              </div>
                              <p className="text-sm text-secondary-600 mb-2">{notification.message}</p>
                              <p className="text-xs text-secondary-400">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-secondary-100">
                    <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative user-menu">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-secondary-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                      <span className="text-sm font-medium text-white group-hover:scale-110 transition-transform duration-300">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  </div>
                  
                  <ChevronDown className={`h-4 w-4 text-secondary-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-secondary-200 z-50 animate-scale-in">
                  <div className="p-4 border-b border-secondary-100 bg-gradient-to-r from-secondary-50 to-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-secondary-500 capitalize">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="dropdown-item"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-secondary-100 py-2">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="dropdown-item text-error-600 hover:bg-error-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-all duration-300 hover:bg-primary-50 rounded-lg"
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
      } overflow-hidden bg-white/95 backdrop-blur-sm border-t border-secondary-200/50`}>
        <nav className="px-4 py-4 space-y-2">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link ${
                  isActive ? 'active' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {/* Mobile user menu items */}
          <div className="border-t border-secondary-200/50 pt-4 mt-4">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="nav-link text-error-600 hover:bg-error-50 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};