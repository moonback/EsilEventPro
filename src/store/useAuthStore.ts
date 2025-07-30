import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials } from '../types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

// Simulation des données d'authentification
const mockUsers = [
  {
    id: '1',
    email: 'admin@eventpro.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'System',
    role: 'admin' as const,
    phone: '+33123456789',
    skills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'tech@eventpro.com',
    password: 'tech123',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'technician' as const,
    phone: '+33987654321',
    skills: [
      { id: '1', name: 'Son', category: 'sound' as const, level: 'expert' as const },
      { id: '2', name: 'Éclairage', category: 'lighting' as const, level: 'intermediate' as const },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          // Simulation de l'API d'authentification
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(
            u => u.email === credentials.email && u.password === credentials.password
          );
          
          if (!user) {
            throw new Error('Identifiants invalides');
          }

          // Simulation des tokens JWT
          const token = `jwt_token_${user.id}_${Date.now()}`;
          const refreshToken = `refresh_token_${user.id}_${Date.now()}`;

          const { password, ...userWithoutPassword } = user;
          
          set({
            user: userWithoutPassword,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          // Simulation du refresh token
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newToken = `jwt_token_refreshed_${Date.now()}`;
          set({ token: newToken });
        } catch (error) {
          // Si le refresh échoue, déconnecter l'utilisateur
          get().logout();
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData, updatedAt: new Date() }
          });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);